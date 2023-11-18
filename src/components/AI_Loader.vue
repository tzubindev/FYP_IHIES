<template>
    <!-- First Loader -->
    <div class="relative translate-y-28 lg:translate-y-24">
        <div class="blob">
            <h1 class="text-[20px]">Waiting...</h1>
        </div>
        <div class="blob1"></div>
        <div class="blob2"></div>
        <div class="blob3"></div>
    </div>
</template>

<script>
export default {};
</script>

<style>
h1 {
    position: relative;
    color: gray;
    font-size: 22px;
    font-weight: 400;
    text-align: center;
    line-height: 7;
    overflow: hidden;
    background: linear-gradient(90deg, #ffffff50, #ffffff99, #ffffff50);
    background-repeat: no-repeat;
    background-size: 80%;
    animation: animate 3s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: rgba(255, 255, 255, 0);
}

@keyframes animate {
    0% {
        background-position: -1000%;
    }
    100% {
        background-position: 1000%;
    }
}

.blob {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #3023ae 0%, #ff0099 100%);
    box-shadow: 0 0 100px 0 rgba(255, 0, 153, 0.7),
        0 0 50px 0 rgba(48, 35, 174, 0.7);
    background-size: 200% 200%;
    animation: ai-blob 3s, gradient 12s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: 4;
}

.blob1 {
    width: 170px;
    height: 170px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #3e29c120;
    animation: ai-blob 4s linear infinite;
    animation-direction: reverse;
    z-index: 3;
}

.blob2 {
    width: 180px;
    height: 180px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #e3117c20;
    animation: ai-blob 5s linear infinite;
    z-index: 2;
}

.blob3 {
    width: 190px;
    height: 190px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #7b20a820;
    animation: ai-blob 3.5s linear infinite;
    z-index: 1;
}

@keyframes ai-blob {
    0% {
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
    20% {
        border-radius: 60% 40% 40% 60% / 60% 25% 75% 40%;
    }
    40% {
        border-radius: 70% 30% 65% 35% / 80% 45% 55% 20%;
    }
    60% {
        border-radius: 30% 70% 70% 30% / 20% 30% 70% 80%;
    }
    80% {
        border-radius: 40% 60% 40% 60% / 70% 55% 45% 30%;
    }
    100% {
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
