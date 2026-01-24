// Empty module to replace canvas in Turbopack
export default {

};


// Exports nommés communs pour canvas
export const createCanvas = () => {
    throw new Error('Canvas n\'est pas disponible dans l\'environnement navigateur');
};

export const loadImage = () => {
    throw new Error('Canvas n\'est pas disponible dans l\'environnement navigateur');
};

export const Image = class {
    constructor() {
        throw new Error('Canvas n\'est pas disponible dans l\'environnement navigateur');
    }
};