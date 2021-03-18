/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

/**
 * 内容接口
 */
export interface MapContentInterface {
    /**
     * 内容的类名
     */
    name: string;
}

/**
 * 内容
 */
export abstract class MapContent implements MapContentInterface {
    /**
     * 内容的类名
     */
    get name(): string {
        return this.constructor.name;
    }
}
