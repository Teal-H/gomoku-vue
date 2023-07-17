<script setup>
import { computed, nextTick, onMounted, ref, watchPostEffect } from 'vue';
import { getAdjacent, getGameResult } from '@/utils/index'

const checkerboardRef = ref(null)

// 棋盘格子数量
const boardCell = ref(20)
// 棋盘点位：xy方向分别比格子数量多1
const xyOffset = ref(Array(boardCell.value + 1).fill())
// x轴分割线位置
const yLineStyle = computed(() => (index) => {
    return {
        left: ((index + 1) / boardCell.value) * 100 + '%',
    }
})
// 棋子宽度
const chessWH = computed(() => `calc(${1 / (boardCell.value + 1) * 100}% - 2px)`)
// 每一行高度
const xLineH = computed(() => `calc(${1 / boardCell.value * 100}%)`)
// 当前落子颜色
const activeChess = ref(1) // 1黑棋 2白棋
// 黑棋集合
const blackChess = ref([])
// 白棋集合
const whiteChess = ref([])

// 落子
const handleClick = (e) => {
    const { offsetX, offsetY } = e
    // 获取点击位置相邻最近的落点
    const { x, y } = getAdjacent({ x: offsetX, y: offsetY }, xyOffset.value)

    const repeatBlack = blackChess.value.some(item => item.x === x && item.y === y)
    const repeatWhite = whiteChess.value.some(item => item.x === x && item.y === y)
    if (repeatBlack || repeatWhite) {
        return alert('该落点已有棋子，请重新选择落点')
    }

    if (activeChess.value === 1) {
        blackChess.value.push({ x, y })
        if (!getGameRes({ x, y }, blackChess.value, whiteChess.value, xyOffset.value, 1)) {
            activeChess.value = 2
        }
    } else {
        whiteChess.value.push({ x, y })
        if (!getGameRes({ x, y }, whiteChess.value, blackChess.value, xyOffset.value, 2)) {
            activeChess.value = 1
        }
    }

}
// 验证结果
const getGameRes = (curPoint, curColorPoints, otherColorPoints, xyPoints, curColor) => {
    const gameRes = getGameResult(curPoint, curColorPoints, otherColorPoints, xyPoints, curColor)
    if (gameRes) {
        const tip = gameRes === 1 ? '黑棋胜' : gameRes === 2 ? '白棋胜' : '平局'
        setTimeout(() => {
            // alert会终止最后一个落点渲染，先延时弹出，后面再优化
            alert(tip + '，点击重新开始')
            blackChess.value = []
            whiteChess.value = []
            activeChess.value = 1
        }, 100);
        return true
    }
}
onMounted(() => {
    let diyBoard = 0
    while (diyBoard < 5) {
        diyBoard = (prompt('定义棋盘格子数量，最小值为5', 20) || 20) - 0
    }
    boardCell.value = diyBoard
})
// 设置棋盘点位二维数据
watchPostEffect(() => {
    if (checkerboardRef.value) {
        const boardRect = checkerboardRef.value.getBoundingClientRect()
        xyOffset.value = xyOffset.value.reduce((pre, _, index) => {
            pre.push(xyOffset.value.map((_, i) => ({
                x: (i / boardCell.value) * boardRect.width,
                y: (index / boardCell.value) * boardRect.height,
            })))
            return pre
        }, [])
        console.log(xyOffset.value, '棋盘点位');
    }
})
</script>

<template>
    <div class="checkerboard" ref="checkerboardRef" @click.self="handleClick($event)">
        <div class="x-line" v-for="_ in boardCell - 1"></div>
        <div class="y-line" v-for="(_, index) in boardCell - 1" :style="yLineStyle(index)"></div>
        <div class="black-chess" v-for="item in blackChess" :style="{ left: item.x + 'px', top: item.y + 'px' }"></div>
        <div class="white-chess" v-for="item in whiteChess" :style="{ left: item.x + 'px', top: item.y + 'px' }"></div>
    </div>
</template>

<style lang="less" scoped>
.checkerboard {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    height: 90vw;
    border: 2px solid #222;

    .x-line {
        height: v-bind(xLineH);
        border-bottom: 1px solid #222;
        pointer-events: none;
    }

    .y-line {
        position: absolute;
        top: 0;
        height: 100%;
        border-right: 1px solid #222;
        pointer-events: none;
    }

    .black-chess,
    .white-chess {
        position: absolute;
        z-index: 2;
        background-color: #000;
        border-radius: 50%;
        width: v-bind(chessWH);
        height: v-bind(chessWH);
        transform: translate(-50%, -50%);
    }

    .white-chess {
        background-color: #fff;
    }
}
</style>