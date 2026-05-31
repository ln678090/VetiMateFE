@echo off

set OUTPUT=project-structure.txt

if exist %OUTPUT% del %OUTPUT%

for %%D in (src app components lib hooks services) do (
    if exist %%D (
        echo ============================== >> %OUTPUT%
        echo %%D >> %OUTPUT%
        echo ============================== >> %OUTPUT%

        tree %%D /F /A >> %OUTPUT%
    )
)

echo Done! Generated: %OUTPUT%
pause