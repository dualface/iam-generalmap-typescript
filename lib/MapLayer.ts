import { MapCell } from "./MapCell";
import { MapContentInterface } from "./MapContent";
import { MapPosition } from "./MapPosition";
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
    private grid: Array<Array<MapCell>> = [];

    /**
     * 构造函数
     *
     * @param name
     * @param size
     */
    constructor(readonly name: string, readonly size: MapSize) {
        this.size = size;
        for (let row = 0; row < size.rows; row++) {
            const cells: Array<MapCell> = [];
            for (let col = 0; col < size.cols; col++) {
                cells.push(new MapCell(col, row));
            }
            this.grid.push(cells);
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
        return this.grid[row][col];
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
     * 清理地图
     */
    cleanup(): void {
        for (let row = 0; row < this.size.rows; row++) {
            for (let col = 0; col < this.size.cols; col++) {
                this.grid[row][col].cleanup();
            }
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
        for (let row = 0; row < this.size.rows; row++) {
            for (let col = 0; col < this.size.cols; col++) {
                const cell = this.grid[row][col];
                cell.findByType(constructor, contents);
            }
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
}
