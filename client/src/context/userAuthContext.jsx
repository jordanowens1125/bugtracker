import {createContext, useContext, useEffect,useState} from 'react'
import { auth } from '../../utils/firebase'
import {createUserWithEmailAndPassword,
    signInWithEmailAndPassword,signOut,
    onAuthStateChanged,GoogleAuthProvider,signInWithPopup,
    sendPasswordResetEmail,
} from 'firebase/auth'

const userAuthContext = createContext()
export function UserAuthContextProvider({children}){
    const [user,setUser] = useState('')
    function signUp(email,password){
        return createUserWithEmailAndPassword(auth, email,password)
    }
    function logIn(email,password){
        return signInWithEmailAndPassword(auth, email,password)
    }
    function logOut(){
        return signOut(auth)
    }
    function googleSignIn(){
        const googleAuthProvider=new GoogleAuthProvider()
        return signInWithPopup(auth,googleAuthProvider)
    }
        useEffect(()=>{
            const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
                setUser(currentUser )
            })
            return ()=>{
                unsubscribe()
            }
        },[])
    return (<userAuthContext.Provider value ={{user,googleSignIn,signUp,logIn,logOut}}>{children}</userAuthContext.Provider>)
}
export const useUserAuth = () => {
    return useContext(userAuthContext)
}
