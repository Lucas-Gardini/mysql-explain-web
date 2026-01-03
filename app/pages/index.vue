<script setup lang="ts">
import { ref } from "vue";

const textareaRows = ref(24);
const explainJson = ref("");
const invalidJson = ref(false);
const image = ref("");

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    explainJson.value = text;
  } catch (e) {
    alert("Não foi possível acessar o clipboard.");
  }
}

function downloadImage() {
  if (!image.value) return;

  const link = document.createElement("a");
  link.href = `data:image/png;base64,${image.value}`;
  link.download = "mysql-explain-visualization.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function validateAndFormatJson() {
  try {
    const parsed = JSON.parse(explainJson.value);
    explainJson.value = JSON.stringify(parsed, null, 4);
    invalidJson.value = false;
  } catch {
    invalidJson.value = true;
  }
}

async function generate() {
  image.value = "";
  try {
    const data = await $fetch("/api/generate", {
      method: "POST",
      body: { explain: explainJson.value },
    });
    image.value = data.image;
  } catch {
    invalidJson.value = true;
    alert("Erro ao gerar a visualização.");
  }
}

function updateTextareaRows() {
  const windowHeight = window.innerHeight;
  const calculatedRows = Math.floor((windowHeight - 300) / 24);
  textareaRows.value = Math.max(10, calculatedRows);
}

onMounted(() => {
  window.addEventListener("resize", updateTextareaRows);
  updateTextareaRows();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateTextareaRows);
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen pt-16 py-8 px-4">
    <div class="max-w-xl w-full flex flex-col items-center gap-6">
      <h1 class="text-2xl font-bold text-center">
        Análise de EXPLAIN JSON do MySQL
      </h1>
      <p class="text-center text-gray-500 dark:text-gray-400">
        Cole abaixo a saída <b>EXPLAIN FORMAT=JSON</b> do MySQL na área abaixo
        para gerar uma visualização.
      </p>
      <div class="w-full flex flex-col md:flex-row items-center gap-4 h-full">
        <div class="flex flex-col gap-4 h-full w-full">
          <UTextarea
            v-model="explainJson"
            placeholder="Cole aqui o EXPLAIN JSON do MySQL..."
            :rows="textareaRows"
            class="w-full"
            @blur="() => validateAndFormatJson()"
          />
          <div class="flex gap-3 w-full justify-center">
            <UTooltip text="Colar da área de transferência">
              <UButton
                icon="i-heroicons-clipboard"
                @click="pasteFromClipboard"
                color="neutral"
              ></UButton>
            </UTooltip>
            <UButton
              icon="i-heroicons-sparkles"
              @click="generate"
              color="primary"
              >Gerar Visualização</UButton
            >
          </div>
        </div>

        <UIcon
          v-if="image"
          name="i-heroicons-arrow-right-20-solid"
          class="w-8 h-8"
        />

        <div v-if="image" class="flex flex-col items-center h-full gap-4">
          <img
            :src="`data:image/png;base64,${image}`"
            alt="Visualização do EXPLAIN"
            class="max-w-full rounded shadow"
          />
          <div class="flex gap-3 w-full justify-center">
            <UButton
              icon="i-heroicons-arrow-down"
              @click="downloadImage"
              color="secondary"
              >Baixar</UButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
