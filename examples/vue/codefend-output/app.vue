<script setup>
import { ref, computed } from "vue";

/**
 * ref
 */
const Ox0 = ref("Hello World");

/**
 * computed
 */
const Ox1 = ref(5);
const Ox2 = computed(() => {
    return Ox1.value + 5;
});

/**
 * function
 */
function Ox3() {
    console.log("clicked");
}
</script>
<template>
    <div class="Ox4">
        {{ Ox2 }}
    </div>
    <div class="Ox5">
        {{ Ox0 }}
    </div>
    <button @click="Ox3">Click me!</button>
</template>
<style lang="css" scoped>
.Ox4 {
    color: red;
}

.Ox5 {
    color: blue;
}
</style>