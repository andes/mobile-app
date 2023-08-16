export function setOptions() {
    return {
        preferFrontCamera: false,
        formats: 'QR_CODE,PDF_417',
        disableSuccessBeep: false,
        showTorchButton: false,
        torchOn: false,
        prompt: 'Ubicar el código de barra frente a la cámara',
        resultDisplayDuration: 500
    };
}
