/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

// 寻路算法来自
// http://github.com/bgrins/javascript-astar

import { BinaryHeap } from "iam-binaryheap-typescript";
import { MapCell } from "./MapCell";
import { MapLayer } from "./MapLayer";
import { MapPosition } from "./MapPosition";

/**
 * 检查单元格是否允许通行
 */
export interface SearchPathCallback {
    (cell: MapCell): boolean;
}

/**
 * 使用 A* 算法在地图层中搜索可以通行的路径
 *
 * @param layer
 * @param startPosition
 * @param endPosition
 * @param callback
 */
export function searchPath(
    layer: MapLayer,
    startPosition: MapPosition,
    endPosition: MapPosition,
    callback: SearchPathCallback
): MapCell[] {
    if (!startPosition.valid()) {
        throw new TypeError(`[PathFinder] invalid start position`);
    }
    if (!endPosition.valid()) {
        throw new TypeError(`[PathFinder] invalid end position`);
    }
    const startCell = layer.get(startPosition);
    const endCell = layer.get(endPosition);

    const marked = new PathNodes();
    const startNode = marked.get(startCell);
    const endNode = marked.get(endCell);
    startNode.h = manhattan(startCell.position, endCell.position);

    const openHeap = new BinaryHeap<PathNode>(function (node: PathNode) {
        return node.f;
    });
    openHeap.push(startNode);

    while (openHeap.size() > 0) {
        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        const currentNode = openHeap.pop();

        // End case -- result has been found, return the traced path.
        if (currentNode === endNode) {
            return pathTo(currentNode);
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        // Find all neighbors for the current node.
        const neighbors = layer.neighbors(currentNode.cell.position);

        for (let i = 0, il = neighbors.length; i < il; ++i) {
            const neighborCell = neighbors[i];
            const neighborNode = marked.get(neighborCell);

            // Not a valid node to process, skip to next neighbor.
            if (neighborNode.closed) continue;
            const passable = callback(neighborCell);
            if (!passable) continue;

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            const globalScore =
                currentNode.g +
                cost(neighborCell.position, currentNode.cell.position);
            const beenVisited = neighborNode.visited;

            if (!beenVisited || globalScore < neighborNode.g) {
                // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                neighborNode.visited = true;
                neighborNode.parent = currentNode;
                neighborNode.h =
                    neighborNode.h ||
                    manhattan(neighborCell.position, endCell.position);
                neighborNode.g = globalScore;
                neighborNode.f = neighborNode.g + neighborNode.h;

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    openHeap.push(neighborNode);
                } else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
                    openHeap.rescoreElement(neighborNode);
                }
            }
        }
    }

    // No result was found - empty array signifies failure to find path.
    return [];
}

//// private

/**
 * 路径节点
 */
class PathNode {
    cell: MapCell;
    f: number = 0; // 移动成本 f = g+h
    g: number = 0; // 起点到当前点移动成本
    h: number = 0; // 当前点到终点估计移动成本
    visited: boolean = false; // 是否已经搜索
    closed: boolean = false; // 是否已经关闭
    parent: PathNode | null = null; // 父节点

    constructor(cell: MapCell) {
        this.cell = cell;
    }
}

/**
 * 路径节点集合
 */
class PathNodes {
    private marked = new Map<MapCell, PathNode>();

    get(cell: MapCell): PathNode {
        let node = this.marked.get(cell);
        if (!node) {
            node = new PathNode(cell);
            this.marked.set(cell, node);
        }
        return node;
    }
}

function manhattan(p1: MapPosition, p2: MapPosition): number {
    return Math.abs(p2.col - p1.col) + Math.abs(p2.row - p1.row);
}

/**
 * 构建从当前节点到顶级父节点的路径
 *
 * @param node
 */
function pathTo(node: PathNode): MapCell[] {
    const path: MapCell[] = [];
    let current = node;
    while (current.parent) {
        path.unshift(current.cell);
        current = current.parent;
    }
    return path;
}

/**
 * 计算两个相邻节点之间的移动成本
 *
 * @param p1
 * @param p2
 */
function cost(p1: MapPosition, p2: MapPosition): number {
    return p2.col !== p1.col && p2.row !== p1.row ? 1.41421 : 1;
}
