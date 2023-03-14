const stats = {};
export function compose (...stack){
  return async function(context){
    await process(stack, context);
    console.log( Object.entries(stats).sort((a, b) => b[1] - a[1]).map(([a,b])=>`${b} seconds: ${a}`).join('\n') );
  }
}
async function process(stack, context){
  for(const instruction of stack){
    const start = Date.now();
    const response = await instruction(context, {progress:'series'});
    const stop = Date.now()
    stats[instruction.name||'unknown'] = (stop - start)/1000;
  }
}
