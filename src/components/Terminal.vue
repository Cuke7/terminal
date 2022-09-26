<template>
    <div ref="draggableContainer" id="draggable-container" @click="inputElement?.focus()" class="lg:text-lg w-4/5 h-4/5 md:w-3/5 md:h-3/5 2xl:w-1/2 bg-black bg-opacity-90 rounded-xl flex-col flex">
        <div class="rounded-t-2xl bg-gray-900 flex justify-between items-center p-2 px-3" id="draggable-header" @mousedown="dragMouseDown">
            <div class="font-mono font-bold text-lg text-white">💻 Welcome back sir</div>

            <div class="flex gap-2">
                <div class="bg-green-500 w-4 h-4 rounded-full" />
                <div class="bg-yellow-500 w-4 h-4 rounded-full" />
                <div class="bg-red-500 w-4 h-4 rounded-full" />
            </div>
        </div>
        <div class="overflow-y-scroll font-mono p-3 pb-4">
            <div v-html="stack" />
            <div class="flex">
                <span id="prefix" class="text-blue-400 text-lg">{{ prefix }}</span>
                <input @keyup.up="up" @keyup.down="down" @keydown.tab="tab" spellcheck="false" @keyup.enter="enter" ref="inputElement" v-model="input" type="text" class="text-white bg-transparent w-full" />
            </div>
            <!-- <div v-for="(suggestion, index) in suggestions" :key="index" class="text-sm text-gray-400 mr-4">
                {{ suggestion.text }}
            </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { search } from "fast-fuzzy";
import { apps } from "../store";

const inputElement = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (inputElement.value) inputElement.value.focus();
});

const prefix = "$ "; // Display prompt
const input = ref(""); // What is typed into the terminal
const stack = ref(""); // What is displayed into the terminal
const cmdHistory = ref<Array<string>>([]);
const indexHistory = ref(0);
// const suggestions = ref([] as any);

const commands = [
    {
        arg: "quotidie",
        async execute() {
            // print("----------Quotidie----------", "text-lg text-blue-500");
            let { data } = await axios.get("/.netlify/functions/quotidie");
            print(data.title.slice(11), "text-white");
            print(data.evangile, "text-gray-400 flex-col");
            // print("----------------------------", "text-lg text-blue-500");
        },
        helpText: "print the gospel of the day",
    },
    {
        arg: "clear",
        execute() {
            stack.value = "";
        },
        helpText: "clear the terminal",
    },
    {
        arg: "help",
        execute() {
            print("How to use", "text-lg text-green-500");
            print('Enter a command to get started, use "tab" to autocomplete available commands.', "text-white");
            print("Available commands :", "text-lg text-green-500");
            for (const cmd of commands) {
                if (cmd.arg != "help") {
                    print(cmd.arg, "text-white");
                    print(cmd.helpText, "text-sm text-gray-400");
                }
            }
            // print("----------------------------", "text-lg text-green-500");
        },
        helpText: "",
    },
    {
        arg: "todo",
        execute() {
            print("- display a loader for async operation", "text-white");
            print("- birbs ?", "text-white");
            print("- music ?", "text-white");
            print("- NASA pic of the day ?", "text-white");
            print("- BING pic of the day ?", "text-white");
            print("- google agenda", "text-white");
            print("- saint du jour", "text-white");
            print("- tram B (ex: tbm roustai) -> sends back suggestions", "text-white");
        },
        helpText: "futurs improvements",
    },
    {
        arg: "notion",
        execute() {
            window.open("https://www.notion.so/cuke/Mariage-M-L-e002ba5915b144b99d5db77518b59ff7", "_blank")?.focus();
        },
        helpText: "open the wedding page on Notion",
    },
    {
        arg: "auditere",
        execute() {
            apps.appsList.push({ name: "🎧 Auditere", url: "https://auditereV2.netlify.app" });
        },
        helpText: "Rock on!",
    },
    {
        arg: "aucellus",
        execute() {
            apps.appsList.push({ name: "🎧 Auditere", url: "https://aucellus.netlify.app/" });
        },
        helpText: "Birbs",
    },
    {
        arg: "tbm",
        execute() {
            apps.appsList.push({ name: "🎧 Auditere", url: "https://tbmapp.netlify.app" });
        },
        helpText: "Wonderfull app for a wonderfull company",
    },
    // {
    //     arg: "tbm",
    //     secondaryOption: true,
    //     async execute() {
    //         if (suggestions.value.length == 1) {
    //             let { data } = await axios.get("/.netlify/functions/tbm?stopID=" + suggestions.value[0].id);
    //             let routes = data.routes;
    //             for (const route of routes) {
    //                 console.log(route)
    //                 print(route.direction, "text-white font-bold");
    //                 let { data } = await axios.get("/.netlify/functions/tbm?externalCode=" + route.externalCode + "&code=" + route.code);
    //                 for (const res of data) {
    //                     for (const direct of res) {
    //                         print(direct.destinationName + " : " + direct.waitTimeText, "text-gray-400");
    //                     }
    //                 }
    //             }
    //         } else {
    //             print("Stop point not found.", "text-red-400");
    //         }
    //     },
    //     helpText: "",
    // },
];

// Parse the command
const cmd = computed(() => {
    return input.value.slice(0).toLocaleLowerCase().split(" ");
});

// watch(cmd, async (cmdVal) => {
//     if (cmd.value.length == 2) {
//         if (cmd.value[0] == "tbm" && cmd.value[1].length > 2) {
//             suggestions.value = [];
//             stack.value = "";
//             let { data } = await axios("https://ws.infotbm.com/ws/1.0/get-schedule/" + encodeURIComponent(cmd.value[1]));
//             for (const stop of data) {
//                 suggestions.value.push({
//                     text: stop.name + " (" + stop.city + ")",
//                     id: stop.id,
//                 });
//             }
//         }
//     } else {
//         suggestions.value = [];
//     }
// });

watch(
    stack,
    () => {
        inputElement.value?.scrollIntoView({ behavior: "smooth" });
    },
    {
        flush: "post",
    }
);

const printCmd = (cmd: string) => {
    stack.value += "<div>";
    stack.value += `<span class="text-blue-400">`;
    stack.value += prefix;
    stack.value += "</span>";
    stack.value += `<span class="text-white">`;
    stack.value += cmd;
    stack.value += "</span>";
    stack.value += "</div>";
};

const print = (text: string, css: string) => {
    stack.value += `<div class="${css}">`;
    stack.value += "  " + text;
    stack.value += "</div>";
};

const enter = async () => {
    cmdHistory.value.push(input.value);
    indexHistory.value = cmdHistory.value.length;
    for (const command of commands) {
        if (command.arg == cmd.value[0]) {
            printCmd(cmd.value.join(" "));
            command.execute();
            input.value = "";
            return;
        }
    }
    input.value = "";
    print("Command not found", "text-red-400");
};

const up = () => {
    if (indexHistory.value > 0) indexHistory.value--;
    input.value = cmdHistory.value[indexHistory.value];
};

const down = () => {
    if (indexHistory.value < cmdHistory.value.length - 1) indexHistory.value++;
    input.value = cmdHistory.value[indexHistory.value];
};

const tab = (event: any) => {
    event.preventDefault();
    if (cmd.value.length == 1 && cmd.value[0].length > 1) {
        let res = search(cmd.value[0], commands, { keySelector: (obj) => obj.arg, returnMatchData: true });
        if (res.length > 0) {
            input.value = res[0].original;
        }
    }
};

// const getTime = () => {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     let hh = today.getHours();
//     let min = today.getMinutes();
//     let mm = today.getMonth() + 1; // Months start at 0!
//     let dd = today.getDate();

//     if (dd < 10) dd = "0" + dd;
//     if (mm < 10) mm = "0" + mm;

//     return dd + "/" + mm + "/" + yyyy;
// };

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
