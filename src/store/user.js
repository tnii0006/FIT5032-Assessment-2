// src/store/user.js
import { reactive } from 'vue'
import { auth } from '@/firebaseConfig'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'

const user = reactive({
  isLoggedIn: false,
  info: {},
  loading: false,
  error: null,

  // 初始化认证状态监听
  initAuth() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.isLoggedIn = true
        this.info = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }
        localStorage.setItem('user', JSON.stringify(this.info))
      } else {
        this.isLoggedIn = false
        this.info = {}
        localStorage.removeItem('user')
      }
      this.loading = false
    })
  },

  // 注册新用户
  async register(email, password) {
    this.loading = true
    this.error = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      this.error = error.message
      throw error
    } finally {
      this.loading = false
    }
  },

  // 登录用户
  async login(email, password) {
    this.loading = true
    this.error = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      this.error = error.message
      throw error
    } finally {
      this.loading = false
    }
  },

  // 登出用户
  async logout() {
    this.loading = true
    try {
      await signOut(auth)
    } catch (error) {
      this.error = error.message
      throw error
    } finally {
      this.loading = false
    }
  }
})

export default user
