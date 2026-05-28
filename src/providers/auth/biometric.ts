import { Injectable } from '@angular/core';
import { FingerprintAIO, FingerprintOptions } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { SecureStorage, SecureStorageObject } from '@awesome-cordova-plugins/secure-storage/ngx';
import { StorageService } from 'src/providers/storage-provider.service';

import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class BiometricService {
    private secureStorageObject: SecureStorageObject | null = null;

    constructor(
        private faio: FingerprintAIO,
        private secureStorage: SecureStorage,
        private localStorage: StorageService,
        private platform: Platform
    ) {
    }

    // Obtiene o inicializa la instancia de SecureStorage de forma tardía (lazy)
    private async obtenerInstanciaStorage(): Promise<SecureStorageObject | null> {
        if (this.secureStorageObject) {
            return this.secureStorageObject;
        }

        const esHibrido = this.platform.is('cordova') || this.platform.is('capacitor') || this.platform.is('hybrid');
        if (!esHibrido) {
            return null;
        }

        try {
            await this.platform.ready();
            if (typeof this.secureStorage.create !== 'function') {
                console.warn('Almacenamiento Seguro: Plugin no detectado o no disponible.');
                return null;
            }
            this.secureStorageObject = await this.secureStorage.create('andes_secure_store');
            return this.secureStorageObject;
        } catch (err) {
            console.error('Error al inicializar el Almacenamiento Seguro:', err);
            return null;
        }
    }

    // Verifica si el dispositivo soporta biometría y está configurada por el usuario
    async estaDisponible(): Promise<boolean> {
        // En el navegador (ionic serve), platform.is('cordova') o 'hybrid' suele ser false.
        const esHibrido = this.platform.is('cordova') || this.platform.is('capacitor') || this.platform.is('hybrid');

        if (!esHibrido) {
            return false;
        }

        if (!this.faio) {
            return false;
        }

        try {
            await this.platform.ready();
            if (typeof this.faio.isAvailable !== 'function') {
                return false;
            }

            const resultado = await this.faio.isAvailable({ requireStrongBiometrics: false });

            // Aseguramos que tratamos el resultado como string si lo es
            if (resultado && typeof resultado === 'string') {
                const res = resultado.toLowerCase();
                return res === 'ok' || res === 'finger' || res === 'face' || res === 'biometric';
            }
            return !!resultado; // Si devuelve un objeto o valor truthy se asume disponible
        } catch (error) {
            return false;
        }
    }

    // Muestra el prompt biométrico nativo
    async autenticar(): Promise<boolean> {
        try {
            await this.platform.ready();
            const opciones: FingerprintOptions = {
                title: 'Ingreso Seguro a ANDES',
                subtitle: 'Autentícate para continuar',
                description: 'Usa tu reconocimiento facial o dactilar registrado en este dispositivo.',
                fallbackButtonTitle: 'Usar PIN/Patrón',
                disableBackup: false,
            };
            await this.faio.show(opciones);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Almacena credenciales de forma encriptada
    async guardarCredencialesSeguras(usuario: any, clave: any, tipo: 'paciente' | 'profesional'): Promise<void> {
        const storage = await this.obtenerInstanciaStorage();
        if (storage) {
            // Aseguramos que los valores sean string para evitar errores con DNI numéricos
            const usuarioStr = String(usuario);
            const claveStr = String(clave);

            // Guardamos con llaves específicas por perfil para evitar sobreescritura
            await storage.set(`username_${tipo}`, usuarioStr);
            await storage.set(`password_${tipo}`, claveStr);
            await storage.set(`type_${tipo}`, tipo);
            await this.localStorage.set(`usarBiometria_${tipo}`, 'true');
            await this.localStorage.set('usarBiometria', 'true'); // Sincronizar legacy para máxima compatibilidad
        } else {
            console.warn('No se pudo guardar: Almacenamiento seguro no disponible.');
        }
    }

    // Almacena el JWT del usuario de forma encriptada (legacy)
    async guardarTokenSeguro(token: string, tipo: 'paciente' | 'profesional' = 'paciente'): Promise<void> {
        const storage = await this.obtenerInstanciaStorage();
        if (storage) {
            await storage.set('secure_token', token);
            await this.localStorage.set(`usarBiometria_${tipo}`, 'true');
        }
    }

    // Recupera credenciales específicas para un perfil
    async obtenerCredencialesSeguras(tipo: 'paciente' | 'profesional'): Promise<{ usuario: string, clave: string, tipo: 'paciente' | 'profesional' } | null> {
        const storage = await this.obtenerInstanciaStorage();
        if (!storage) {
            return null;
        }
        try {
            const usuario = await storage.get(`username_${tipo}`);
            const clave = await storage.get(`password_${tipo}`);
            const tipoGuardado = await storage.get(`type_${tipo}`) as 'paciente' | 'profesional';

            if (!usuario || !clave) {
                // Soporte legacy: intentar recuperar con llaves viejas si no existen las nuevas
                const oldUser = await storage.get('username');
                const oldPass = await storage.get('password');
                const oldType = await storage.get('type') as 'paciente' | 'profesional';

                if (oldUser && oldPass && (!oldType || oldType === tipo)) {
                    return { usuario: oldUser, clave: oldPass, tipo: tipo };
                }
                return null;
            }

            return { usuario, clave, tipo: tipoGuardado };
        } catch (e) {
            return null;
        }
    }

    // Intenta obtener CUALQUIER credencial guardada (para el login automático al arrancar)
    async obtenerCualquierCredencialSegura(): Promise<{ usuario: string, clave: string, tipo: 'paciente' | 'profesional' } | null> {
        // Probamos profesional primero (o podrías chequear la última usada si tuviéramos esa info)
        let creds = await this.obtenerCredencialesSeguras('profesional');
        if (!creds) {
            creds = await this.obtenerCredencialesSeguras('paciente');
        }
        return creds;
    }

    // Recupera el JWT encriptado
    async obtenerTokenSeguro(): Promise<string | null> {
        const storage = await this.obtenerInstanciaStorage();
        if (storage) {
            try {
                return await storage.get('secure_token');
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Borra las credenciales en el logout, pero MANTIENE la preferencia de usarBiometria
    async limpiarDatosSeguros(): Promise<void> {
        const storage = await this.obtenerInstanciaStorage();
        if (storage) {
            try {
                await storage.remove('secure_token');
                // IMPORTANTE: NO borramos username/password/type aquí
                // así la biometría sigue funcionando después del logout.
            } catch (e) {
                // Ya estaba vacío o no existe
            }
        }
    }

    // Verifica si el usuario activó la funcionalidad para un perfil específico
    async biometriaActivadaPorUsuario(tipo: 'paciente' | 'profesional'): Promise<boolean> {
        const val = await this.localStorage.get(`usarBiometria_${tipo}`);
        return val === 'true';
    }

    // Verifica si ALGÚN perfil tiene activada la biometría (para el arranque)
    async biometriaActivadaGlobalmente(): Promise<boolean> {
        const paciente = await this.localStorage.get('usarBiometria_paciente');
        const profesional = await this.localStorage.get('usarBiometria_profesional');
        // Soporte legacy para la key vieja durante la transición
        const legacy = await this.localStorage.get('usarBiometria');
        return paciente === 'true' || profesional === 'true' || legacy === 'true';
    }

    // Gestiona si debemos volver a preguntar al usuario por perfil
    async marcarComoRechazado(valor: boolean, tipo: 'paciente' | 'profesional'): Promise<void> {
        await this.localStorage.set(`biometric_dismissed_${tipo}`, valor ? 'true' : 'false');
    }

    // Desactiva la funcionalidad para un perfil (limpia la preferencia)
    async desactivarBiometria(tipo: 'paciente' | 'profesional'): Promise<void> {
        await this.localStorage.remove(`usarBiometria_${tipo}`);
        await this.localStorage.remove('usarBiometria'); // Limpiar legacy también para evitar re-activaciones fantasma
    }

    async puedeMostrarMensaje(tipo: 'paciente' | 'profesional'): Promise<boolean> {
        const disponible = await this.estaDisponible();
        const yaActivado = await this.biometriaActivadaPorUsuario(tipo);
        const rechazado = await this.localStorage.get(`biometric_dismissed_${tipo}`);
        const tieneCredenciales = await this.obtenerCredencialesSeguras(tipo);

        // Solo mostramos si está disponible, no está activado para ESTE tipo,
        // no fue rechazado antes para ESTE tipo y no tiene credenciales guardadas de este tipo (o ninguna)
        const mismaCategoria = tieneCredenciales && tieneCredenciales.tipo === tipo;
        return disponible && !yaActivado && rechazado !== 'true' && !mismaCategoria;
    }
}
