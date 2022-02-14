# node-cli-search

This package allows you to find files and folders based on the name using a string.

## Install

```
yarn global add node-cli-search
```

## Usage

Navigate to the folder where you want to conduct the search. Then run the following:

```
dir-search -q <partial file name here>
```

Assuming the directory index:

```
/root
|- folder1
|- folder2
   |- folder2-1
      |- ListOfGroceries.ts
```

and then you run `dir-search -q groceries`

It will output:

```
/root/folder2/folder2-1/ListOfGroceries.ts
```

You can also provide a context, a subfolder in the directory where you want to limit the search to. So in this case, if I want to only search in `folder1`, then I will have to run `dir-search -q groceries -c folder1` which I will not get any output because there's no file or folder in `root/folder1/**/**` that matches my query.

By default, the search is **NOT case-sensitive**. Please see help for more details.

## Display help

```
dir-search -h
```

## Use-cases

- When you are renaming bunch of folders or files manually and you are looking for files or folders that you haven't renamed yet.
