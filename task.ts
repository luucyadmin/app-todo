export class Task {
    createdAt = new Date().toISOString();
    done = false;

    location?: { 
        latitude: number, 
        longitude: number 
    };

    constructor(public name: string) {}
}