export default (id, text, name, typeRef = 'string') => {
  return {
    id: id,
    text: text,
    name: name,
    typeRef: typeRef
  };
};