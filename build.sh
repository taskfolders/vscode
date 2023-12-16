name=$(cat package.json | jq -r .name)
version=$(cat package.json | jq -r .version)
file="$name-$version.vsix"
cmd="npx vsce package --out _build/vsix/$file"
echo + $cmd
eval $cmd
