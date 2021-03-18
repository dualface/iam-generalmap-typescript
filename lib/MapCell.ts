/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

import { MapContentInterface } from "./MapContent";
import { MapPosition } from "./MapPosition";
import { Constructor } from "./__private";

/**
 * 地图单元格
 */
export class MapCell {
    /**
     * 单元格 ID，由位置信息构成
     */
    readonly id: string;

    /**
     * 单元格所在位置
     */
    readonly position: MapPosition;

    /**
     * 单元格中的所有内容
     */
    readonly contents: Array<MapContentInterface> = [];

    /**
     * 单元格的标志值
     */
    get flags(): number {
        return this._flags;
    }

    /**
     * 标志值的内部存储
     */
    private _flags: number = 0;

    /**
     * 构造函数
     *
     * @param col
     * @param row
     */
    constructor(col: number, row: number);

    /**
     * 构造函数
     *
     * @param position
     */
    constructor(position: MapPosition);

    constructor(...args: [col: number, row: number] | [position: MapPosition]) {
        if (args.length === 2) {
            this.position = new MapPosition(args[0], args[1]);
        } else {
            this.position = args[0].clone();
        }
        this.id = this.position.toString();
        this.cleanup();
    }

    /**
     * 添加内容到单元格
     *
     * @param content 内容
     */
    add(content: MapContentInterface): void {
        this.contents.push(content);
    }

    /**
     * 删除指定内容
     *
     * @param content
     */
    delete(content: MapContentInterface): void {
        for (let i = 0, l = this.contents.length; i < l; i++) {
            if (this.contents[i] === content) {
                this.contents.splice(i, 1);
                return;
            }
        }
        throw new RangeError(
            `MapCell.delete(): not found content '${content}' in cell <${this.position}>`
        );
    }

    /**
     * 检查指定内容是否存在
     *
     * @param find
     */
    has(find: MapContentInterface): boolean {
        for (const content of this.contents) {
            if (find === content) return true;
        }
        return false;
    }

    /**
     * 查找特定类型的所有内容
     *
     * @param constructor
     * @param contents
     */
    findByType<T extends MapContentInterface>(
        constructor: Constructor<T>,
        contents: T[] = []
    ): T[] {
        const name = constructor.name;
        for (const content of this.contents) {
            if (content.name === name) {
                contents.push(content as T);
            }
        }
        return contents;
    }

    /**
     * 删除指定类型的所有内容，并返回被删除的内容
     *
     * @param constructor
     */
    deleteByType<T extends MapContentInterface>(
        constructor: Constructor<T>
    ): T[] {
        const name = constructor.name;
        const removed: T[] = [];
        for (let l = this.contents.length, i = l - 1; i >= 0; i--) {
            if (this.contents[i].name === name) {
                removed.push(this.contents[i] as T);
                this.contents.splice(i, 1);
            }
        }
        return removed;
    }

    /**
     * 计算指定类型内容的数量
     *
     * @param constructor
     */
    countByType<T extends MapContentInterface>(
        constructor: Constructor<T>
    ): number {
        const name = constructor.name;
        let count = 0;
        for (const content of this.contents) {
            if (content.name === name) count++;
        }
        return count;
    }

    /**
     * 清除所有内容
     */
    deleteAll(): void {
        this.contents.length = 0;
    }

    /**
     * 检查单元格是否包含指定的标志
     *
     * @param flags 标志
     */
    checkFlags(flags: number): boolean {
        return (this._flags & flags) != 0;
    }

    /**
     * 添加标志，返回更新后的标志
     *
     * @param flags 标志
     */
    addFlags(flags: number): number {
        this._flags |= flags;
        return this._flags;
    }

    /**
     * 删除标志，返回更新后的标志
     *
     * @param flags 标志
     */
    deleteFlags(flags: number): number {
        this._flags &= ~flags;
        return this._flags;
    }

    /**
     * 仅保留指定标志，返回更新后的标志
     *
     * @param mask
     */
    maskingFlags(mask: number): number {
        this._flags &= mask;
        return this._flags;
    }

    /**
     * 清理标志
     */
    deleteAllFlags(): void {
        this._flags = 0;
    }

    /**
     * 清理
     */
    cleanup(): void {
        this.deleteAll();
        this.deleteAllFlags();
    }
}
