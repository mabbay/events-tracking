<template>
    <div id="fromBar" class="fixed_submit_btn">
        <div class="px-4 py-3 bg-white shadow rounded border-0 border-t-3 border-solid border-primary" >
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "si-form-bar",
    props: {
    },
};
</script>
<style>
</style>