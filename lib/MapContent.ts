/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

import { MapPosition } from "./MapPosition";

/**
 * 内容接口
 */
export interface MapContentInterface {
    /**
     * 内容的类名
     */
    name: string;

    /**
     * 内容所在的位置
     */
    position: MapPosition;
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

    /**
     * 构造函数
     *
     * @param position 内容所在的位置
     */
    constructor(readonly position: MapPosition) {}
}
