import { MapCell } from "./MapCell";
import { MapContentInterface } from "./MapContent";
import { MapPosition } from "./MapPosition";
import { searchPath, SearchPathCallback } from "./MapSearchPath";
import { MapSize } from "./MapSize";
import { Constructor } from "./__private";

/**
 * 地图层
 *
 * 每个地图层由矩形网格组成，网格中每个格子是一个 MapCell 对象。
 */
export class MapLayer {
    /**
     * 网格
     */
    readonly cells: Array<MapCell> = [];

    /**
     * 构造函数
     *
     * @param name
     * @param size
     */
    constructor(readonly name: string, readonly size: MapSize) {
        this.cells.length = size.rows * size.cols;
        let i = 0;
        for (let row = 0; row < size.rows; row++) {
            for (let col = 0; col < size.cols; col++) {
                this.cells[i] = new MapCell(col, row);
                i++;
            }
        }
    }

    /**
     * 检查指定位置是否存在单元格
     *
     * @param position
     */
    has(
        ...args: [position: MapPosition] | [col: number, row: number]
    ): boolean {
        let col = 0;
        let row = 0;
        if (args.length === 2) {
            col = args[0];
            row = args[1];
        } else {
            col = args[0].col;
            row = args[0].row;
        }
        return (
            col >= 0 && col < this.size.cols && row >= 0 && row < this.size.rows
        );
    }

    /**
     * 获取指定单元格
     *
     * @param position
     */
    get(
        ...args: [position: MapPosition] | [col: number, row: number]
    ): MapCell {
        let col = 0;
        let row = 0;
        if (args.length === 2) {
            col = args[0];
            row = args[1];
        } else {
            col = args[0].col;
            row = args[0].row;
        }
        if (!this.has(col, row)) {
            throw new RangeError(
                `MapLayer.getCell(): position <${col},${row}> out range of map grid`
            );
        }
        return this.cells[row * this.size.cols + col];
    }

    /**
     * 返回指定单元格的邻居
     *
     * @param position
     * @param withDiagonal
     */
    neighbors(position: MapPosition, withDiagonal: boolean = false): MapCell[] {
        var cells: MapCell[] = [];
        const { col, row } = position;
        // 西方 West
        if (this.has(col - 1, row)) {
            cells.push(this.get(col - 1, row));
        }
        // 东方 East
        if (this.has(col + 1, row)) {
            cells.push(this.get(col + 1, row));
        }
        // 南方 South
        if (this.has(col, row - 1)) {
            cells.push(this.get(col, row - 1));
        }
        // 北方 North
        if (this.has(col, row + 1)) {
            cells.push(this.get(col, row + 1));
        }

        if (withDiagonal) {
            // 西南方 Southwest
            if (this.has(col - 1, row - 1)) {
                cells.push(this.get(col - 1, row - 1));
            }

            // 东南方 Southeast
            if (this.has(col + 1, row - 1)) {
                cells.push(this.get(col + 1, row - 1));
            }

            // 西北方 Northwest
            if (this.has(col - 1, row + 1)) {
                cells.push(this.get(col - 1, row + 1));
            }

            // 东北方 Northeast
            if (this.has(col + 1, row + 1)) {
                cells.push(this.get(col + 1, row + 1));
            }
        }
        return cells;
    }

    /**
     * 使用 A* 算法在地图层中搜索可以通行的路径
     *
     * @param startPosition
     * @param endPosition
     * @param callback
     */
    searchPath(
        startPosition: MapPosition,
        endPosition: MapPosition,
        callback: SearchPathCallback
    ): MapCell[] {
        return searchPath(this, startPosition, endPosition, callback);
    }

    /**
     * 清理地图
     */
    cleanup(): void {
        for (const cell of this.cells) {
            cell.cleanup();
        }
    }

    /**
     * 查找当前层中所有指定类型的内容
     *
     * @param type 内容类型
     */
    findContentsByType<T extends MapContentInterface>(
        constructor: Constructor<T>
    ): T[] {
        const contents: T[] = [];
        for (const cell of this.cells) {
            cell.findByType(constructor, contents);
        }
        return contents;
    }

    /**
     * 移动内容到指定位置的单元格
     *
     * @param content
     * @param to
     */
    moveContent(content: MapContentInterface, to: MapPosition): void {
        this.get(content.position).delete(content);
        this.get(to).add(content);
    }

    /**
     * 添加内容到指定位置的单元格
     *
     * @param position
     * @param content 内容
     */
    addContentAt(position: MapPosition, content: MapContentInterface): void {
        this.get(position).add(content);
    }

    /**
     * 从指定位置的单元格删除特定内容
     *
     * @param position
     * @param content
     */
    deleteContentAt(position: MapPosition, content: MapContentInterface): void {
        this.get(position).delete(content);
    }

    /**
     * 检查指定位置的单元格是否存在特定内容
     *
     * @param position
     * @param find
     */
    hasContentAt(position: MapPosition, find: MapContentInterface): boolean {
        return this.get(position).has(find);
    }

    /**
     * 查找指定位置的单元格中特定类型的所有内容
     *
     * @param position
     * @param constructor
     * @param contents
     */
    findContentsByTypeAt<T extends MapContentInterface>(
        position: MapPosition,
        constructor: Constructor<T>,
        contents: T[] = []
    ): T[] {
        return this.get(position).findByType(constructor, contents);
    }

    /**
     * 删除指定位置的单元格中特定类型的所有内容，并返回被删除的内容
     *
     * @param position
     * @param constructor
     */
    deleteContentsByTypeAt<T extends MapContentInterface>(
        position: MapPosition,
        constructor: Constructor<T>
    ): T[] {
        return this.get(position).deleteByType(constructor);
    }

    /**
     * 计算指定位置的单元格中特定类型内容的数量
     *
     * @param position
     * @param constructor
     */
    countContentsByTypeAt<T extends MapContentInterface>(
        position: MapPosition,
        constructor: Constructor<T>
    ): number {
        return this.get(position).countByType(constructor);
    }

    /**
     * 清除指定位置的单元格中的所有内容
     *
     * @param position
     */
    deleteContentsAllAt(position: MapPosition): void {
        this.get(position).deleteAll();
    }

    /**
     * 检查指定位置的单元格是否包含特定的标志
     *
     * @param position
     * @param flags 标志
     */
    checkFlagsAt(position: MapPosition, flags: number): boolean {
        return this.get(position).checkFlags(flags);
    }

    /**
     * 在指定位置的单元格添加标志，返回更新后的标志
     *
     * @param position
     * @param flags 标志
     */
    addFlagsAt(position: MapPosition, flags: number): number {
        return this.get(position).addFlags(flags);
    }

    /**
     * 在指定位置的单元格删除标志，返回更新后的标志
     *
     * @param position
     * @param flags 标志
     */
    deleteFlagsAt(position: MapPosition, flags: number): number {
        return this.get(position).deleteFlags(flags);
    }

    /**
     * 在指定位置的单元格中保留特定标志，返回更新后的标志
     *
     * @param position
     * @param mask
     */
    maskingFlagsAt(position: MapPosition, mask: number): number {
        return this.get(position).maskingFlags(mask);
    }

    /**
     * 清理指定位置的单元格中的标志
     *
     * @param position
     */
    deleteAllFlagsAt(position: MapPosition): void {
        this.get(position).deleteAllFlags();
    }
}
