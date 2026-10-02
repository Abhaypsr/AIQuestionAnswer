const noteAssets = import.meta.glob('../AI-103/*.docx', {
  eager: true,
  query: '?url',
  import: 'default'
});

export const notes = Object.entries(noteAssets)
  .map(([path, url]) => ({
    name: path.split('/').pop(),
    url
  }))
  .sort((first, second) => first.name.localeCompare(second.name));
