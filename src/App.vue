<template>
    <div class="w-screen h-screen flex justify-center items-center">
        <Terminal />
    </div>
</template>

<script lang="ts" setup>
import Terminal from "./components/Terminal.vue";
</script>

<style>
input {
    outline: none;
}

body {
    /* The image used */
    background-image: url("./assets/bg2.jpg");

    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
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
