<template>
<div id="range2">
<div class="outer">
  <div class="middle">
    <div class="inner">
        <div class="login-wr">
          <h2>Вход</h2>
          <div class="form">
            <input type="text" placeholder="Пользователь" maxlength="12" v-model="login">
            <input type="password" placeholder="Пароль" minlength="12" v-model="password">
            <select class="form-control" v-model="selectAccess"> 
                <option disabled value="">Выберите роль</option>                
                <option v-for="(access, index) in select" :key="index">
                    {{access}}
                </option>
                </select> 
            <router-link to="/Registration"><h6> У вас нет аккаунта? Регистрация </h6></router-link>
            <button @click="loginUser()">Авторизация </button>
          </div>
        </div>
    </div>
  </div>
</div>
</div>
</template>

<script>

export default {
  name: 'LoginPage',
  data () {
    return {
        login: null,
        password: null,
        select: ['Ученый секретарь', 'Преподаватель', 'Зав. кафедрой'],
        selectAccess: '',
        users: [
            { login: 'AlekseevAsu', password: 'Asu1', name: 'Алексеев В.А.', role: 'Зав. кафедрой' },
            { login: 'VedischevAsu', password: 'Asu2', name: 'Ведищев В.В.', role: 'Преподаватель' },
            { login: 'DomayshnevAsu', password: 'Asu3', name: 'Домашнев П.А.', role: 'Преподаватель ' },
            { login: 'GaevAsu', password: 'Asu4', name: 'Гаев Л.В.', role: 'Преподаватель' },
            { login: 'NazarkinAsu', password: 'Asu5', name: 'Назаркин О.А.', role: 'Преподаватель' },
            { login: 'BoldyrikhinAsu', password: 'Asu6', name: 'Болдырихин О.В.', role: 'Преподаватель' }
        ],
        auth: false
    }
  },
  methods: {
    loginUser () { 
        if (!this.login || !this.password || this.selectAccess == '') {
            this.$alert("Заполните всю информацию!", "Предупреждение", "warning");
        } else {
            sessionStorage.clear()
            this.forEachUsers()          
            if(this.selectAccess == 'Ученый секретарь' && this.auth == true) {   
                this.$router.push({ name: 'Plans'})                    
            } else if (this.selectAccess == 'Преподаватель' && this.auth == true) {
                this.$router.push({ name: 'MainTeacher'})            
            } else {
                this.$alert("Пользователь не найден!", "Ошибка", "error");
            }
        }       
    },
    forEachUsers () {    
        this.users.forEach(this.isPositive)
    },
    isPositive (element) {
        if (element.login == this.login && element.password == this.password && element.role == this.selectAccess) {
            this.auth = true
            sessionStorage.setItem('userAuth', element.name)
        }
    }
  }
}
</script>

<style scoped>
body{
    height : 100%;
    padding: 0;
    margin: 0;
    font-size: 14px;
    background-color:lightblue;
}

.outer {
    display: table;
    width: 100%;
    height: 100%;
    text-align: center;
}
.middle {
    display: table-cell;
    vertical-align: middle;
}
.inner {
    text-align: center;
    width: auto;
    padding: 0 15px;
}
#range2 {
    height: 100%;
    min-height: 400px;
    margin-top: 100px;
}
#range2 .login-wr {
    position: relative;
    margin: 0 auto;
    background: #fff;
    max-width: 650px;
    box-shadow: 3px 3px 10px #333;
    padding: 15px 15px 0 15px;
}

#range2 h2 {
    text-align: left;
    font-weight: 200;
    font-size: 1.6em;
    margin: 0 0 10px 0;
    padding: 0 0 10px 0;
    border-bottom: 1px solid #eeeeee;
    color: #474747;
}

#range2 .form {
    padding-top: 20px;
    text-align: center;
}

#range2 input[type="text"] {
    background: url("http://s1.iconbird.com/ico/2013/8/429/w24h241377939745185082manpeoplestreamlineuser7.png") no-repeat left 7px center;
}

#range2 input[type="password"] {
    background: url("http://s1.iconbird.com/ico/2014/1/607/w26h261390848377private26.png") no-repeat left 7px center;
}

#range2 input[type="text"],
#range2 input[type="password"],
#range2 button {
    margin-bottom: 25px;
    height: 40px;
    outline: 0;
}

#range2 input[type="text"],
#range2 input[type="password"] {
    width: calc(80% - 45px);
    border: 1px solid #bbb;
    padding: 0 0 0 45px;
    font-size: 14px;
}

#range2 input[type="text"]:focus,
#range2 input[type="password"]:focus {
    border: 1px solid #2196f3;
}

#range2 a {
    text-align: center;
    font-size: 12px;
    color: #3498db;
}

#range2 button {
    width: 80%;
    background: #2196f3;
    border: none;
    border-bottom: 5px solid #2184d7;
    color: white;
    font-size: 18px;
    font-weight: 200;
    cursor: pointer;
    transition: box-shadow .4s ease;
    margin-top: 10px;
}
#range2 select {
    width: calc(80% - 45px);
    margin-left: 85px;
    margin-bottom: 15px;
}

#range2 p {
    padding-bottom: 10px;
}
</style>
