<template>
  <div class="main">
    <div class="top">
      <span>Please connect to your wallet first👉</span>
      <button v-if="!selectedAddress" @click="connectWallet">ConnectWallet</button>
      <span v-else>{{ selectedAddress }}</span>
    </div>
    <div class="qa-box">
      <div v-for="(item, index) in dynamicValidateForm"  :key="index" class="qa-item">
        <div class="qa-title">question{{ index + 1 }}</div>
        <div class="question">
          <span>
            {{ item.question }}
          </span>
          <div v-if="['singleChoice', 'multipleChoice'].includes(item.type)" class="select">
            <span v-for="(tag, index) in item.answerItem" :key="tag">{{ abc[index] }}.{{ tag }}</span>
          </div>
          <div v-if="['judgment'].includes(item.type)" class="select">
            <span>A.YES</span>
            <span>B.NO</span>
          </div>
        </div>
        <div class="answer">
          <span>Type your answer here</span>
          <input v-model="item.tempValue" type="text" placeholder="Type your answer here">
        </div>
      </div>
    </div>
    <div class="summarization">
      <span>Answer summarization</span>
      <input type="text" v-model="answer" placeholder="Answer summarization" readonly style="border-radius: 4px;
  line-height: 24px;
  outline: none;
  border: 1px solid #ccc;
  height: 32px;">
    </div>
    <!-- <div>
      <label for="inputData">输入数据：</label>
      <input type="text" id="inputData" />
    </div> -->
    <el-button style="margin-top: 10px;" @click="sendTransaction" type="primary">Submit</el-button>
    <div class="summarization">
      <span>{{ hashValue }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from 'axios'
import { useRoute } from 'vue-router';
import { baseurl }  from './api'
const route = useRoute()
const selectedAddress = ref('')
const hashValue = ref('')
var walletConnect = false;
var contractAddress = '0xDc7b20dadf2573F9b8687a232A208f246bFd73EB';
const answer = computed(() => {
  let str = []
  dynamicValidateForm.value.forEach(item => {
    if (!item.tempValue) return
    str.push(String(item.tempValue))
  })
  return str.join(",")
})
const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
let dynamicValidateForm = ref([])

async function init() {
  // 检查用户是否安装了 Metamask
  if (typeof web3 !== 'undefined') {
    // 使用已存在的提供商
    web3 = new Web3(web3.currentProvider);
  } else {
    // 提示用户安装 Metamask
    alert('请安装并登录 Metamask');
    return;
  }
}

// 连接钱包
async function connectWallet() {
  try {
    // 请求连接钱包
    await ethereum.request({
      method: 'eth_requestAccounts'
    });
    walletConnect = true


    console.log('已连接钱包');
    console.log(walletConnect);
    selectedAddress.value = window.ethereum.selectedAddress
    alert('已连接钱包')
  } catch (error) {
    console.error('连接钱包出错:', error);
  }
}
// 数据上链
async function sendTransaction() {
  // 获取用户输入的数据
  const inputData = answer.value;
  console.log(inputData)
  try {
    // 获取当前连接的账户
    const accounts = await ethereum.request({
      method: 'eth_accounts'
    });
    const from = accounts[0]; // 使用第一个账户
    // const web3 = new Web3(web3.currentProvider);
    // 构建交易对象
    const txObject = {
      from: from,
      to: '0x0000000000000000000000000000000000000000',
      value: 0,
      data: web3.utils.asciiToHex(inputData),
    };

    // 发送交易
    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [txObject],
    });

    console.log('交易哈希:', txHash);
    hashValue.value = 'Your Hash:' + txHash;
    alert('Your content has been successfully recorded and an NFT has given you as reward')


    generateNFT()
  } catch (error) {
    console.error('发送交易出错:', error);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNFT() {

  if (!walletConnect) {
    alert('Please connect your wallet first!');
    return;
  }


  var to = window.ethereum.selectedAddress;
  var tokenId = getRandomInt(1000, 9999);
  var uri = 'ipfs://QmTNWS6r3iNN57NSFqfiNZ2WLSGDK6eHY6xzu5vV97hsfN';
  web3 = new Web3();

  const data = web3.eth.abi.encodeFunctionCall({
    name: 'safeMint',
    type: 'function',
    inputs: [{
      type: 'address',
      name: 'to'
    },
    // {
    //     type: 'uint256',
    //     name: 'tokenId'
    // },
    {
      type: 'string',
      name: 'uri'
    }
    ]
  }, [to, uri]);

  // Call the Sepolia smart contract
  window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [{
      to: contractAddress,
      from: window.ethereum.selectedAddress,
      data: data, // Function signature for the safeMint method
    }],
  }).then(function (accounts) {
    alert('wait NFT generated');
  }).catch(function (error) {
    alert('Error generating NFT. Please try again.');
  });

}
onMounted(() => {
  init()
  if (  window.ethereum && window.ethereum.selectedAddress) {
    selectedAddress.value = window.ethereum.selectedAddress
  }
  if (route.query.id) {
    axios.get(baseurl + "get/" + route.query.id).then(res => {
    const arr = res.data.data
    let ress = []
    arr.forEach(element => {
      element.question = JSON.parse(element.question)
      ress = (element.question)
    });
    ress.forEach(element => {
      element.tempValue = ''
    });
    console.log(ress)
    dynamicValidateForm.value = ress
    console.log(dynamicValidateForm)
  })
  }
  
})

</script>
<style>
.ep-button {
  margin: 4px;
}

.ep-button+.ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
