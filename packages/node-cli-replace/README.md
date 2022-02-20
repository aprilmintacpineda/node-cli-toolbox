# node-cli-replace

This tool allows you to replace a given `query` with whatever you want in a file or files.

## Install

```
yarn global add node-cli-replace
```

## Usage

Navigate to the folder where you want to conduct the replace. Then run the following:

```
node-cli-replace -q __value__ -v foo -f file.ts -i node_modules
```

This command will replace the text `__value__` with `foo`.

**input**

```ts
const file = "__value__";
```

**output**

```ts
const file = "foo";
```

If you omit the `-v` argument, it will remove the value instead of replace it.

Example:

```
node-cli-replace -q __value__ -f file.ts -i node_modules
```

**input**

```ts
const file = "__value__";
```

**output**

```ts
const file = "";
```

## Per line

You can add `-l` flag to change the behaviour to a per-line basis.

Example:

```
node-cli-replace -q TEST_VALUE= -v NEW_KEY=foo -f prod.env -i node_modules -l
```

**input**

```
TEST_VALUE1=testvalue1
TEST_VALUE=testvalue
```

**output**

```
TEST_VALUE1=testvalue1
NEW_KEY=foo
```

And if you omit the `-v` argument, it will remove that line instead.

Example:

```
node-cli-replace -q TEST_VALUE= -f prod.env -i node_modules -l
```

**input**

```
TEST_VALUE1=testvalue1
TEST_VALUE=testvalue
```

**output**

```
TEST_VALUE1=testvalue1

```

## Display help

```
dir-search -h
```

## Sample use-case

- On CI/CD, when you want to replace an existing value in a file with another value during build.
