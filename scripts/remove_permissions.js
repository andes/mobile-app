const fs = require('fs/promises')
const xml2js = require('xml2js')

const REMOVE_PERMISSIONS = [
    'android.permission.REQUEST_INSTALL_PACKAGES',
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
            const name = attrs['android:name'] // Assuming xmlns:android has been set as usual...
            if (REMOVE_PERMISSIONS.includes(name)) {
                console.log(`Removing permission "${name}" from AndroidManifest.xml`)
                return false
            } else {
                return true
            }
        })
    }
    const newManifest = (new xml2js.Builder()).buildObject(manifest)
    await fs.writeFile(manifestPath, newManifest)
}