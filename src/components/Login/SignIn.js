import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { useRef, useState } from 'react'
import 'primeflex/primeflex.css'
import logo from "../../assets/images/contrato.png"
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { classNames } from 'primereact/utils';
import {useHistory} from 'react-router-dom'
import { Toast } from "primereact/toast"

export const SignIn = () => {
    const [checked1, setChecked1] = useState(false)
    const navigate = useHistory()
    const toast = useRef(null)

    //React-hook-form
    const schema = yup.object().shape({
        email: yup.string().email("Correo electrónico inválido. Ej: contratos@email.com").required("Correo es requerido"),
        password: yup.string().required("Contraseña es requerida"),
    })
    const {handleSubmit, control, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema),
    })

    const handle = ({email, password}) => {
        if(email==="gustavo.murga1996@gmail.com" && password==="1"){
            navigate.push("/")
        }else{
            showError("Credenciales inválidas.")
        }
        reset();
    }
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const showError = (message) => {
        toast.current.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    }
    return (
        <div className="flex flex-column align-items-center justify-content-center m-8">
            <Toast ref={toast} position="bottom-center"/>
            <div className="surface-card py-6 px-6 xl:px-6 lg:px-4 md:px-4 sm:px-2 shadow-2 border-round xl:w-30rem lg:w-30rem md:w-30rem sm:w-30rem">
                <div className="text-center mb-3">
                    <img src={logo} alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-4xl font-medium mb-3">Contratos</div>
                </div>
                    <form onSubmit={handleSubmit(handle)} className="p-fluid">
                        <label htmlFor="email" className={classNames({ 'p-error': errors.email }, "block text-900 font-medium mb-2")}>Correo*</label>
                        <Controller
                         name="email"
                         defaultValue="gustavo.murga1996@gmail.com"
                         control={control}
                         render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field}
                             className={classNames({ 'p-invalid': fieldState.invalid}, "w-full")} />
                        )}
                        />
                        {getFormErrorMessage('email')}
                        <label htmlFor="password" className={classNames({ 'p-error': errors.password }, "block text-900 font-medium my-2")}>Contraseña*</label>
                        <Controller
                            name="password"
                            defaultValue="1"
                            control= {control}
                            render={ ({field, fieldState}) => (
                                <Password id={field.name} {...field} inputClassName={classNames({ 'p-invalid': fieldState.invalid}, "w-full")} className="w-full" toggleMask feedback={false}/>
                            )
                            }
                        />
                        {getFormErrorMessage('password')}
                        <div className="flex align-items-center justify-content-between mt-2 mb-6">
                            <div className="flex align-items-center">
                                <Checkbox id="rememberme" binary className="mr-2" checked={checked1} onChange={(e) => setChecked1(e.checked)} />
                                <label htmlFor="rememberme">Guardar credenciales</label>
                            </div>
                            <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">¿Olvidaste tu contraseña?</a>
                        </div>
                        <Button type="submit" label="Aceptar" className="w-full" />
                    </form>
                </div>
        </div>
    )
}
