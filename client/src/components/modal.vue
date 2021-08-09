<template>
<transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div v-if="messages.length != 0">
              <div class="card mb-3" v-for="message in messages" :key="message.messages_id">          
                <div class="row no-gutters">
                    <div class="col-md-8">
                        <div class="card-body">                   
                        <p>{{message.messages_content}}</p>
                        <p class="sender">{{message.users_name}} {{message.messages_date.slice(0,-14) + ' ' + message.messages_date.slice(11,-8)}}</p>               
                        </div>          
                    </div>
                    </div>             
              </div>
              </div>
              <div v-else class="noNotification">
                <p>Нет уведомлений</p>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <button class="btn btn-block btn-primary" style="width: 200px;" @click="$emit('close')">
                    закрыть
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition> 
</template>

<script>

export default {
  name: 'modal',
  props: {
    messages: {
        type: Array,
        default: function () {
            return {}
        }
    }
  },
  mounted() {
    this.parsedTime()
  },
  methods: {
    parsedTime () {
      if (this.messages.length != 0) {
        this.messages.forEach(element => {   
          element.users_name = this.getFIO(element.users_name)
        });
      }
    },
    getFIO (fullFio) {
      var temp = fullFio.split(' ')
      var shortFIO = temp [0] + ' ' + temp [1][0] + '. ' + temp [2][0] + '.'
      return shortFIO
    }
  }
}
</script>

<style scoped>
.noNotification {
  text-align: center;
  font-family: Century Gothic;
  font-size: 20px;
  color: rgb(163, 161, 165);
}
.sender {
  position: absolute;
  font-family: Century Gothic;
  top: 0;
  margin-left: 600px;
  padding: 10px 20px 10px 30px;
  background-color: rgb(128, 133, 128);
  color: white;
  font-size: 13px;
  width: 318px;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 1000px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 20px 0;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
