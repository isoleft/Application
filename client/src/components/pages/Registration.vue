<template>
    <div class="container" style="margin-left: 40%;">
    <div class="row">
        <div class="col-xs-12">
            <h1 class="hh">Регистрация нового пользователя</h1>
            <form>
                <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                v-model.trim="Login" /><label>Логин</label></div>
                <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                v-model.trim="Name" /><label>ФИО</label></div>
                <div class="placeholder-container"><input size="70" type="text" placeholder=" " 
                v-model.trim="Mail" /><label>Email</label></div>
                <div class="placeholder-container">
                <select v-model="selectAccess" style="color: rgb(85, 85, 85);"> 
                <option disabled value="">Выберите роль</option>                
                    <option v-for="(access, index) in optionRole" :key="index">
                        {{ access.access_type }}
                    </option>
                </select> 
                </div>
                <div class="placeholder-container">
                <select v-model="selectDepart" style="color: rgb(85, 85, 85);"> 
                <option disabled value="">Выберите кафедру</option>                
                    <option v-for="(access, index) in optionDepart" :key="index">
                        <label>{{ access.department_name }} </label>                  
                    </option>
                </select> 
                </div>
                <div class="placeholder-container"><input size="70" type="password" placeholder=" " 
                v-model.trim="Password"/><label>Пароль</label></div>
                <div class="placeholder-container"><input size="70" type="password" placeholder=" " 
                v-model.trim="confirmPassword"/><label>Подтверждение пароля</label></div>                         
                                          
                <div class="form-group"><button class="btn btn-block btn-primary" type="button" name="addPlan" id="addPlan" @click="Registration()">Регистрация</button></div>
                <section><button class="btn btn-success btn-block" type="button" @click="goBack()">Вернуться к авторизации</button></section>              
            </form>
        </div>   
    </div>
</div>
</template>

<script>
import requestService from '@/services/requestsService'

export default {
  name: 'Registration',
  data () {
    return {
        Login: null,
        Name: null,
        Mail: null,
        Password: null,
        confirmPassword: null,
        selectAccess: '',
        selectDepart: '',
        optionRole: [ 
            {'access_type': 'Ученый секретарь', 'access_id': 0}, 
            {'access_type': 'Преподаватель', 'access_id': 1}, 
            {'access_type': 'Заведующий кафедрой', 'access_id': 2}
        ],
        optionDepart: []
    }
  },
  mounted () {
    this.fetchListDepartment()
  },
  methods: {
    async Registration () {
        if (this.Login && this.Name && this.Mail && this.selectAccess && this.selectDepart && this.Password && this.confirmPassword) {
            if(this.Password == this.confirmPassword) {
                try {
                    const res = await requestService.addNewUser({
                        users_login: this.Login,
                        users_name: this.Name,
                        users_mail: this.Mail,
                        users_password: this.Password,
                        access_id: this.optionRole.filter(e => e.access_type == this.selectAccess)[0].access_id,
                        department_id: this.optionDepart.filter(e => e.department_name == this.selectDepart)[0].department_id
                    })
                    this.$alert(res.data.message, "Успешно", "success");
                    this.goBack()                  
                } catch (e) {
                    this.$alert('Данный логин уже занят. Попробуйте другой!', "Ошибка", "error");
                }                                            
            } else {
                this.$alert("Пароли не совпадают", "Ошибка", "error");
            }
      } else {
        this.$alert("Заполните всю информацию!", "Предупреждение", "warning");
      }
    },
    async fetchListDepartment () {
        const response = await requestService.listDepartment()
        this.optionDepart = response.data
    },
    goBack () {
        this.$router.push({ name: 'LoginPage' })
    }
  }
}
</script>

<style scoped>
.hh {
  font-size: 25pt;
  font-family: Century Gothic;
  text-align: center;
  color: rgb(163, 161, 165);
  margin-top: 20px;
  margin-bottom: 25px;
}
.placeholder-container {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
}
.placeholder-container input {
    background-color: #FFF;
    border: 2px solid #d9dfe4;
    box-sizing: border-box;
    color: #000;
    font-size: 16px;
    line-height: 16px;  
    height: 50px;
    outline: 0;
    padding: 0 20px;
    width: 100%;
}
.placeholder-container select {
    background-color: #FFF;
    border: 2px solid #d9dfe4;
    box-sizing: border-box;
    color: #000;
    font-size: 16px;
    line-height: 16px;  
    height: 50px;
    outline: 0;
    padding: 0 20px;
    width: 100%;
}
.placeholder-container label {
    color: rgb(85, 85, 85);
    font-family: Century Gothic;   
    background-color: #FFF;
    font-size: 16px;
    line-height: 16px;
    padding: 5px 10px;
    pointer-events: none;
    position: absolute;
    transition: all 200ms;
    top: 12px;
    left: 10px;
    background-color: #FFF;
}
.placeholder-container input:focus + label,
.placeholder-container input:not(:placeholder-shown) + label{
    top: -10px;
    left: 10px;
    font-size: 17px; 
    background-color: #BFE2FF;
    padding: 2px 10px;
}
</style>
