import type {GenericObject} from '../../types'

export const linearSearch =(list:any[],condition:(element:GenericObject)=>boolean)=>{
    for(let element of list){
        if(condition(element)){
            return element
        }else{
            return "item not found"
        }
    }
}

