<script setup>
import { ref, computed } from "vue";

/**
 * ref
 */
const ref_message = ref("Hello World");

/**
 * computed
 */
const ref_count = ref(5);
const computed_count = computed(() => {
    return ref_count.value + 5;
});

/**
 * function
 */
function f_onButtonClicked() {
    console.log("clicked");
}
</script>
<template>
    <div class="css_count">
        {{ computed_count }}
    </div>
    <div class="css_message">
        {{ ref_message }}
    </div>
    <button @click="f_onButtonClicked">Click me!</button>
</template>
<style lang="css" scoped>
.css_count {
    color: red;
}

.css_message {
    color: blue;
}
</style>