## For crosscheck reviewers

- arguments support following escape syntax:

```bash
cat "File Path With Spaces"
```

```bash
cat File\ Path\ With\ Spaces
```

- you must specify file extension `.br` when using `compress/decompress`

```bash
compress file.txt file.txt.br
```

- please, do not be confused by folder name `src/modules`, other files such as `store.js`, `utils.js`, `errors.js` are also NodeJS modules: overall number of modules in project is 8 (without `index.js`)

- you can clear terminal using `clear` command

## List of available commands

- `.exit` or `exit`
- `clear`
- `ls`
- `pwd`
- `up`
- `cd path_to_directory`
- `os`
  - `--EOL`
  - `--cpus`
  - `--homedir`
  - `--username`
  - `--architecture`
- `cat path_to_file`
- `add new_filename`
- `rn path_to_file new_filename`
- `cp path_to_file path_to_new_directory`
- `mv path_to_file path_to_new_directory`
- `rm path_to_file`
- `hash path_to_file`
- `compress path_to_file path_to_new_file.br`
- `decompress path_to_file_.br path_to_new_file`
