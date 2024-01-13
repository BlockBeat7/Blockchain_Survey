<template>
  <div style="padding: 20px;background: #fff;">
    <el-button @click="addQuestion">Add Question</el-button>
    generate address： <span style="color: brown">{{ address }} </span>
    <el-button @click="openWIndow">open</el-button>
    <el-form v-for="(item, index) in dynamicValidateForm" :model="item" label-width="120px" size="small" style="border: 1px #ccc solid;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-top: 20px;
    border-radius: 10px;">
      <el-form-item label="question index">
        <span>{{ index  + 1 }}</span>
      </el-form-item>
      <el-form-item label="question">
        <el-input v-model="item.question" />
      </el-form-item>
      <el-form-item label="question type">
        <el-select v-model="item.type">
          <el-option label="single choice" value="singleChoice" />
          <el-option label="multiple choice" value="multipleChoice" />
          <el-option label="judgment" value="judgment" />
          <el-option label="blank" value="blank" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="['singleChoice', 'multipleChoice'].includes(item.type)" label="question item">
        <el-tag @close="close(item.answerItem, index)" v-for="(tag, index) in item.answerItem" :key="tag" class="mx-1" closable>
          {{ tag }}
        </el-tag>
        <el-input v-model="item.tempValue" style="width:300px" size="small"></el-input>
        <el-button @click="addItem(item)">Add Item</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align: center;margin-top: 10px;"><el-button type="primary" @click="sumbit">Sumbit</el-button></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { baseurl }  from './api'
const close = (arr, index) => {
  arr.splice(index, 1)
}
const openWIndow = function() {
  if (!address.value) return
  window.open(address.value)
}
const dynamicValidateForm = reactive([{
  question: '',
  type: 'singleChoice',
  answerItem: [],
  tempValue: ''
}])
const address = ref('')
const addQuestion = () => {
  dynamicValidateForm.push({
    question: '',
    type: 'singleChoice',
    answerItem: [],
    tempValue: ''
  })
}
const addItem = (item:any) => {
  const { answerItem, tempValue } = item
  if (!tempValue) return
  answerItem.push(tempValue)
  item.tempValue = ''
}
const sumbit = () => {
  let flag = false
  for (let index = 0; index < dynamicValidateForm.length; index++) {
    const element = dynamicValidateForm[index];
    const {answerItem, question, type} = element
    if (!question) {
      ElMessage({
        message: `please input question index${index + 1} question.`,
        type: 'error',
      })
      flag = true
      break
    }
    if (['singleChoice', 'multipleChoice'].includes(type) && !answerItem.length) {
      ElMessage({
        message: `please input question index${index + 1} question item.`,
        type: 'error',
      })
      flag = true
      break
    }
  }
  if (flag) return
  axios.post(baseurl + "add", {
    data: dynamicValidateForm
  }, {
    headers: {
          'Content-Type': 'application/json'
      },
  }).then((res) => { 
    console.log(res.data.id)
    address.value = `${window.location.origin}/#/detail?id=${res.data.id}`
    // address
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
  })
  })
  
  console.log(dynamicValidateForm)
}

</script>

