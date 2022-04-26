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
import { useNavigate } from 'react-router-dom'
import { Toast } from "primereact/toast"
import { autenticarUsuario } from '../../database/GraphQLStatements'
import { useLazyQuery} from '@apollo/client'
import { actionTypes } from '../../Reducer'
import { AuthContainer } from '../User/AuthContainer'

export const SignIn = () => {
    const [checked1, setChecked1] = useState(false)
    const {login} = AuthContainer.useContainer()
    const toast = useRef(null)
   
    //React-hook-form
    const schema = yup.object().shape({
        username: yup.string().required("Nombre de usuario es requerido"),
        password: yup.string().required("Contraseña es requerida"),
    })
    const {handleSubmit, control, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema),
    })

    const handle = ({username, password}) => {
        login(username, password, 850)
        reset();
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="flex flex-column align-items-center justify-content-center h-screen">
            <Toast ref={toast}/>
            <div className="surface-card py-6 px-6 xl:px-6 lg:px-4 md:px-4 sm:px-2 shadow-2 border-round xl:w-30rem lg:w-30rem md:w-30rem sm:w-30rem">
                <div className="text-center mb-3">
                    <img src={logo} alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-4xl font-medium mb-3">Contratos</div>
                </div>
                    <form onSubmit={handleSubmit(handle)} className="p-fluid">
                        <label htmlFor="username" className={classNames({ 'p-error': errors.username }, "block text-900 font-medium mb-2")}>Usuario*</label>
                        <Controller
                         name="username"
                         defaultValue="PEPITO"
                         control={control}
                         render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field}
                             className={classNames({ 'p-invalid': fieldState.invalid}, "w-full")} />
                        )}
                        />
                        {getFormErrorMessage('username')}
                        <label htmlFor="password" className={classNames({ 'p-error': errors.password }, "block text-900 font-medium my-2")}>Contraseña*</label>
                        <Controller
                            name="password"
                            defaultValue="PEPITO*2022"
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
                            <a href="/#" className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">¿Olvidaste tu contraseña?</a>
                        </div>
                        <Button type="submit" label="Aceptar" className="w-full" />
                    </form>
                </div>
        </div>
    )
}
