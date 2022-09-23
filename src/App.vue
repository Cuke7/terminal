<template>
    <div class="w-screen h-screen flex justify-center items-center">
        <div @click="inputElement?.focus()" class="w-4/5 h-4/5 sm:w-1/2 sm:h-3/5 bg-black bg-opacity-90 rounded-xl flex-col flex">
            <div class="rounded-t-2xl bg-gray-900 flex justify-between items-center p-2 px-3">
                <div class="font-mono font-bold text-lg text-white">💻 Welcome back sir</div>
                <div class="font-mono font-bold text-lg text-white">{{ getTime() }}</div>

                <div class="flex gap-2">
                    <div class="bg-green-500 w-4 h-4 rounded-full" />
                    <div class="bg-yellow-500 w-4 h-4 rounded-full" />
                    <div class="bg-red-500 w-4 h-4 rounded-full" />
                </div>
            </div>
            <div ref="toto" class="overflow-y-scroll font-mono p-3 pb-4">
                <div v-html="stack" />
                <div class="flex">
                    <span id="prefix" class="text-blue-400 text-lg">{{ prefix }}</span>
                    <input @keyup.up="up" spellcheck="false" @keyup.enter="enter" ref="inputElement" v-model="input" type="text" class="text-white bg-transparent w-full" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
const prefix = "$ ";
const input = ref("");
const inputElement = ref<HTMLInputElement | null>(null);
const stack = ref("");
const toto = ref(null);

onMounted(() => {
    if (inputElement.value) inputElement.value.focus();
});

console.log(input.value.slice(2));

const cmd = computed(() => {
    return input.value.slice(0).toLocaleLowerCase();
});

watch(
    stack,
    () => {
        inputElement.value?.scrollIntoView({ behavior: "smooth" });
    },
    {
        flush: "post",
    }
);

const print = (text: string, color: string) => {
    stack.value += `<div class="${color}">`;
    stack.value += "  " + text;
    stack.value += "</div>";
};

const enter = async () => {
    if (cmd.value == "quotidie") {
        input.value = "";
        print("----------Quotidie----------", "text-lg text-blue-500");
        let { data } = await axios.get("/.netlify/functions/quotidie");
        print(data.title.slice(11), "text-white");
        print(data.evangile, "text-gray-400 flex-col");
        print("----------------------------", "text-lg text-blue-500");
        return;
    }

    if (cmd.value == "clear") {
        input.value = "";
        stack.value = "";
        return;
    }

    if (cmd.value == "help") {
        input.value = "";
        print("------------HELP------------", "text-lg text-green-500 flex justify-center ");
        print("clear", "text-white flex justify-center ");
        print("clear the terminal", "text-sm text-gray-400 flex justify-center ");
        print("quotidie", "text-white flex justify-center ");
        print("print the gospel of the day", "text-sm text-gray-400 flex justify-center ");
        print("notion", "text-white flex justify-center ");
        print("open the wedding page on Notion", "text-sm text-gray-400 flex justify-center ");
        print("todo", "text-white flex justify-center ");
        print("futurs improvements", "text-sm text-gray-400 flex justify-center ");
        print("----------------------------", "text-lg text-green-500 flex justify-center ");

        return;
    }

    if (cmd.value == "notion") {
        input.value = "";
        window.open("https://www.notion.so/cuke/Mariage-M-L-e002ba5915b144b99d5db77518b59ff7", "_blank")?.focus();
        return;
    }

    if (cmd.value == "todo") {
        input.value = "";
        print("- UP and down arrows to navigate previous commands", "text-white");
        print("- press tab to aucomplete", "text-white");
        print("- display a loader for async operation", "text-white");
        print("- birbs ?", "text-white");
        print("- music ?", "text-white");
        print("- NASA pic of the day ?", "text-white");
        print("- BING pic of the day ?", "text-white");
        print("- google agenda", "text-white");
        print("- saint du jour", "text-white");
        print("- tram B (ex: tbm roustai) -> sends back suggestions", "text-white");
        return;
    }

    print("Command not found", "text-red-400");
};

const up = () => {
    input.value = "quotidie";
};

const getTime = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let hh = today.getHours();
    let min = today.getMinutes();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "/" + mm + "/" + yyyy;
};
</script>

<style>
input {
    outline: none;
}

body {
    /* The image used */
    background-image: url("./assets/bg.jpg");

    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

span {
    white-space: pre;
}

/* width */
::-webkit-scrollbar {
    width: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #4575af;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
