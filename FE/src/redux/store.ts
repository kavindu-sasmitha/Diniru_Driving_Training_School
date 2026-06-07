import { configureStore } from "@reduxjs/toolkit"
import { counterReducer } from "./reducer/countReducer"

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})
