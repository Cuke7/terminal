<template>
    <div ref="draggableContainer" id="draggable-container" class="rounded-xl flex-col flex">
        <div class="rounded-t-2xl bg-gray-900 flex justify-between items-center p-2 px-3" id="draggable-header" @mousedown="dragMouseDown">
            <div class="font-bold text-white font-mono text-lg">{{ name }}</div>
            <div class="flex gap-2">
                <div class="bg-green-500 w-4 h-4 rounded-full" />
                <div class="bg-yellow-500 w-4 h-4 rounded-full" />
                <div class="bg-red-500 w-4 h-4 rounded-full" @click="removeApp" />
            </div>
        </div>
        <iframe :src="url" width="400" height="650" frameborder="0" class="rounded-b-xl"></iframe>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { apps } from "../store";

const props = defineProps({
    url: String,
    name: String,
});

const removeApp = () => {
    for (let i = 0; i < apps.appsList.length; i++) {
        let app = apps.appsList[i];
        if (props.name == app.name) {
            apps.appsList.splice(i, 1);
            return;
        }
    }
};

// DRAGABLE
const positions = {
    clientX: undefined,
    clientY: undefined,
    movementX: 0,
    movementY: 0,
};

const dragMouseDown = (event: any) => {
    event.preventDefault();
    // get the mouse cursor position at startup:
    positions.clientX = event.clientX;
    positions.clientY = event.clientY;
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
};

const draggableContainer = ref<HTMLInputElement | null>(null);

const elementDrag = (event: any) => {
    event.preventDefault();
    if (positions.clientX && positions.clientY) {
        positions.movementX = positions.clientX - event.clientX;
        positions.movementY = positions.clientY - event.clientY;
    }
    positions.clientX = event.clientX;
    positions.clientY = event.clientY;
    // set the element's new position:
    if (draggableContainer.value) {
        draggableContainer.value.style.top = draggableContainer.value.offsetTop - positions.movementY + "px";
        draggableContainer.value.style.left = draggableContainer.value.offsetLeft - positions.movementX + "px";
    }
};

const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
};
</script>

<style scoped>
#draggable-container {
    position: absolute;
    z-index: 9;
}
#draggable-header {
    z-index: 10;
}
span {
    white-space: pre;
}
</style>
