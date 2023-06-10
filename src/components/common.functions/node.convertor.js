export function nodeConvertor(status){
  const result = {};
  status.map((options, index) => {
    result[options.name] = options.value;
  })
  return result;
}