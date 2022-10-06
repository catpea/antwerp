const stats = [];
let run = -1;
let counter = 0;
const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
function pad(value, length) {
    return (value.toString().length < length) ? pad(" "+value, length):value;
}
function worker(stack){

  return async function(context){
    for(const instruction of stack){
      // const start_time = process.hrtime();
      const start = Date.now()
      const response = await instruction(context, {progress:'series'});
      const stop = Date.now()
      // const end_time = process.hrtime(start_time);
      // console.log(`#${counter++}: ${instruction.name} (${end_time[0]} second, ${end_time[1].toLocaleString('en-US')} nanoseconds)`);
      // console.log(`#${counter++}: ${instruction.name} (${(stop - start)/1000} seconds)`);
      if(instruction.name){
        if(!stats[run]) stats[run]={};
        stats[run][instruction.name] = (stop - start)/1000;
      }

      if(response === true){
        break;
      }
    }
  }
}

function root(...stack){
  return worker(stack)
}

export function parallel (...stack){ return async (context) => Promise.all( stack.map(instruction=>instruction(context, {progress:'parallel'}))) }

export const ask = root;


export const cache    = root;
export const series   = root;

export function compose (...stack){
    return async function(context){
      run = run + 1;

      await worker(stack)(context);
      // console.log( Object.entries(stats[run]).sort((a, b) => b[1] - a[1]).map(([k,v])=>`${pad(v,5)}s: ${k}`));
      console.log( Object.entries(stats[run]).sort((a, b) => b[1] - a[1]) );
    }
}
