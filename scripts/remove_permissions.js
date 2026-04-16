const fs = require('fs/promises')
const xml2js = require('xml2js')
const REMOVE_PERMISSIONS = [
    'android.permission.REQUEST_INSTALL_PACKAGES'
]
module.exports = async function (context) {
    const root = context.opts.projectRoot
    const manifestPath = root + '/platforms/android/app/src/main/AndroidManifest.xml'
    const manifestXml = await fs.readFile(manifestPath)
    const manifest = await xml2js.parseStringPromise(manifestXml)
    const usesPermissions = manifest.manifest['uses-permission']
    if (Array.isArray(usesPermissions)) {
        manifest.manifest['uses-permission'] = usesPermissions.filter(usesPermission => {
            const attrs = usesPermission.$ || {}
            const name = attrs['android:name']
            const version = attrs['android:maxSdkVersion']
            if (!version && REMOVE_PERMISSIONS.includes(name)) {
                console.log(`Removing permission "${name}" from AndroidManifest.xml`)
                return false
            } else {
                return true
            }
        })
    }
    const newManifest = (new xml2js.Builder()).buildObject(manifest)
    await fs.writeFile(manifestPath, newManifest)

    // ---- FIX MainActivity dinámico ----

    const path = require('path')

    const configXml = await fs.readFile(root + '/config.xml', 'utf-8')
    const match = configXml.match(/<widget[^>]*id="([^"]+)"/)

    if (match) {
        const pkg = match[1]
        const pkgPath = pkg.replace(/\./g, '/')

        const javaDir = path.join(
            root,
            'platforms/android/app/src/main/java',
            pkgPath
        )

        await fs.mkdir(javaDir, { recursive: true })

        const activityPath = path.join(javaDir, 'MainActivity.java')

        const content = `
            package ${pkg};

            import android.os.Bundle;
            import org.apache.cordova.*;

            public class MainActivity extends CordovaActivity {
                @Override
                public void onCreate(Bundle savedInstanceState) {
                    super.onCreate(savedInstanceState);

                    Bundle extras = getIntent().getExtras();
                    if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
                        moveTaskToBack(true);
                    }

                    loadUrl(launchUrl);
                }
            }
        `

        await fs.writeFile(activityPath, content.trim() + '\n')

        console.log(`MainActivity generado en ${activityPath}`)
    }
}

