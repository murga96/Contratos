import axios from "axios"

export const onClickTipoContratos = async() => {
    axios.delete("http://localhost:8080/api/user/3").then(res => {  
        console.log(res.data)
        return res.data
      }).catch(error => console.log(error))
}
