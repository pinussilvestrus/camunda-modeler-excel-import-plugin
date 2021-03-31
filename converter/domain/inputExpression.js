export default (id, text, typeRef = 'string') => {
  return {
    id: id,
    text: text,
    typeRef: typeRef
  };
};