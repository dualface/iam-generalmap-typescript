export type Constructor<T = unknown> = new (...args: any[]) => T;

export function content(type: string) {
    return (ctor: Function) => {
        Object.defineProperty(ctor, "type", {
            value: type,
            writable: false,
        });
    };
}
