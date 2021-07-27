export function setOptions() {
    return {
        preferFrontCamera: false,
        formats: 'QR_CODE,PDF_417',
        disableSuccessBeep: false,
        showTorchButton: true,
        torchOn: true,
        prompt: 'Poner el código de barra en la cámara',
        resultDisplayDuration: 500
    };
}
