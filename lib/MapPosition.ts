/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

/**
 * 地图上的位置
 */
export class MapPosition {
    /**
     * 行
     */
    col: number;

    /**
     * 列
     */
    row: number;

    /**
     * 创建一个无效的地图位置点
     */
    static INVALID = function (): MapPosition {
        return new MapPosition(NaN, NaN);
    };

    /**
     * 创建 col 和 row 为 0 的 MapPosition
     */
    static ZERO = function (): MapPosition {
        return new MapPosition(0, 0);
    };

    /**
     * 构造函数
     *
     * @param col
     * @param row
     */
    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    }

    /**
     * 判断是否为有效的位置
     */
    valid(): boolean {
        return (
            typeof this.col === "number" &&
            typeof this.row === "number" &&
            !isNaN(this.col) &&
            !isNaN(this.row)
        );
    }

    /**
     * 比较两个位置是否相等
     *
     * @param other
     */
    equals(other: MapPosition): boolean {
        return (
            Math.abs(this.col - other.col) < 0.00000001 &&
            Math.abs(this.row - other.row) < 0.00000001
        );
    }

    /**
     * 克隆
     */
    clone(): MapPosition {
        return new MapPosition(this.col, this.row);
    }

    /**
     * 转换为取整后的位置
     */
    toFixed(): MapPosition {
        return new MapPosition(Math.floor(this.col), Math.floor(this.row));
    }

    /**
     * 转换为四舍五入取整后的位置
     */
    toRound(): MapPosition {
        return new MapPosition(Math.round(this.col), Math.round(this.row));
    }

    /**
     * 转换为字符串
     */
    toString(): string {
        return this.col + ":" + this.row;
    }

    /**
     * 计算两点个地图点之间的距离
     *
     * @param p1
     * @param p2
     */
    static distance(p1: MapPosition, p2: MapPosition): number {
        const dx = Math.abs(p1.col - p2.col);
        const dy = Math.abs(p1.row - p2.row);
        return Math.sqrt(dx * dx + dy * dy);
    }
}
