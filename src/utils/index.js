/**
 * 找到最近的落点
 * @param {Object} point 当前点击的地方
 * @param {Array} points 网格二维数组点
 */
export const getAdjacent = (point, points) => {
    // x差值取第一项就可以了，往后每一组x值相同
    const absX = points[0].reduce((pre, item) => {
        pre.push(Math.abs(point.x - item.x))
        return pre
    }, [])
    // y插值取每一项的第一组数据
    const absY = points.reduce((pre, item) => {
        pre.push(Math.abs(point.y - item[0].y))
        return pre
    }, [])
    const adjacentX = Math.min(...absX)
    const adjacentY = Math.min(...absY)
    const xIndex = absX.findIndex(i => i === adjacentX)
    const yIndex = absY.findIndex(i => i === adjacentY)
    return {
        x: points[0][xIndex].x,
        y: points[yIndex][0].y,
    }
}

/**
 * 获取对局结果
 * @param {Object} curPoint 当前点击的点位
 * @param {Array} curColorPoints 当前颜色已落点所有棋子
 * @param {Array} otherColorPoints 另一个颜色所有棋子
 * @param {Number} allPoints 棋盘所有二维点位
 * @param {String} curColor 当前棋子颜色
 * @returns 返回对局情况：1黑胜 2白胜 3平局
 */
export const getGameResult = (curPoint, curColorPoints, otherColorPoints, allPoints, curColor) => {
    const curCoord = {
        xIndex: allPoints[0].findIndex(item => item.x === curPoint.x),
        yIndex: allPoints.findIndex(item => item[0].y === curPoint.y),
    }
    console.log(curCoord);

    // X方向五连子的九种可能与当前已落子颜色对比
    const minXIndex = curCoord.xIndex - 4
    const maxXIndex = curCoord.xIndex + 4
    for (let i = minXIndex; i < maxXIndex + 1; i++) {
        let continuousCount = 0
        for (let j = i; j < i + 5; j++) {
            const isFind = curColorPoints.some(item => item.x === allPoints[0]?.[j]?.x && item.y === curPoint.y)  // 这里的循环可能超出棋盘点位，返回为false就可以了
            if (isFind) {
                continuousCount++
            }
        }
        if (continuousCount === 5) {
            // 五连子
            console.log('x-->');
            return curColor
        }
    }
    // Y方向
    const minYIndex = curCoord.yIndex - 4
    const maxYIndex = curCoord.yIndex + 4
    for (let i = minYIndex; i < maxYIndex + 1; i++) {
        let continuousCount = 0
        for (let j = i; j < i + 5; j++) {
            const isFind = curColorPoints.some(item => item.y === allPoints[j]?.[0]?.y && item.x === curPoint.x)  // 这里的循环可能超出棋盘点位，返回为false就可以了
            if (isFind) {
                continuousCount++
            }
        }
        if (continuousCount === 5) {
            // 五连子
            console.log('y-->');
            return curColor
        }
    }

    // 左上到右下方向
    let y_i = minYIndex // 初始化y最小值，y值循环跟随x值循环
    for (let i = minXIndex; i < maxXIndex + 1; i++) {
        let continuousCount = 0
        let y_j = y_i
        for (let j = i; j < i + 5; j++) {
            const isFind = curColorPoints.some(item => item.y === allPoints[y_j]?.[0]?.y && item.x === allPoints[0]?.[j]?.x)  // 这里的循环可能超出棋盘点位，返回为false就可以了
            if (isFind) {
                continuousCount++
            }
            y_j++
        }
        y_i++
        if (continuousCount === 5) {
            // 五连子
            console.log('左上-->右下');
            return curColor
        }
    }

    // 右上到左下方向
    let y_i_m = maxYIndex // 初始化y最大值，y值循环跟x值循环反向
    for (let i = minXIndex; i < maxXIndex + 1; i++) {
        let continuousCount = 0
        let y_j_m = y_i_m
        for (let j = i; j < i + 5; j++) {
            const isFind = curColorPoints.some(item => item.y === allPoints[y_j_m]?.[0]?.y && item.x === allPoints[0]?.[j]?.x)  // 这里的循环可能超出棋盘点位，返回为false就可以了
            if (isFind) {
                continuousCount++
            }
            y_j_m--
        }
        y_i_m--
        if (continuousCount === 5) {
            // 五连子
            console.log('左下-->右上');
            return curColor
        }
    }

    if (curColorPoints.length + otherColorPoints.length === Math.pow(allPoints.length, 2)) {
        // 平局
        return 3
    }
}