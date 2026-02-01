MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_spine_merge
ab_spine_merge is a function
ab_spine_merge () 
{ 
    PR=$1;
    REPO=${2:-AlligatorBrainProjects/directors-console};
    REQUIRED_LABELS=("spine-candidate" "evidence-required");
    if [ -z "$PR" ]; then
        echo "❌ Usage: ab_spine_merge <PR_NUMBER> [REPO]";
        return 1;
    fi;
    echo "🔎 Preflight check for PR #$PR in $REPO...";
    PR_JSON=$(gh pr view $PR --repo "$REPO" --json number,title,state,mergeable,mergeStateStatus,labels 2>/dev/null);
    if [ -z "$PR_JSON" ]; then
        echo "❌ Could not fetch PR #$PR. Check number/repo.";
        return 1;
    fi;
    TITLE=$(echo "$PR_JSON" | jq -r '.title');
    STATE=$(echo "$PR_JSON" | jq -r '.state');
    MERGEABLE=$(echo "$PR_JSON" | jq -r '.mergeable');
    MERGE_STATUS=$(echo "$PR_JSON" | jq -r '.mergeStateStatus');
    LABELS=$(echo "$PR_JSON" | jq -r '.labels[].name' | tr '\n' ' ');
    echo "";
    echo "📌 PR: #$PR | $TITLE";
    echo "State: $STATE";
    echo "Mergeable: $MERGEABLE";
    echo "Merge Status: $MERGE_STATUS";
    echo "Labels: $LABELS";
    echo "";
    if [ "$STATE" != "OPEN" ]; then
        echo "❌ Blocked: PR is not OPEN (state=$STATE)";
        return 1;
    fi;
    if [ "$MERGEABLE" != "MERGEABLE" ]; then
        echo "❌ Blocked: PR not mergeable (mergeable=$MERGEABLE)";
        return 1;
    fi;
    if [ "$MERGE_STATUS" != "CLEAN" ] && [ "$MERGE_STATUS" != "HAS_HOOKS" ]; then
        echo "❌ Blocked: PR merge state is not clean (mergeStateStatus=$MERGE_STATUS)";
        return 1;
    fi;
    for lbl in "${REQUIRED_LABELS[@]}";
    do
        if [[ ! "$LABELS" =~ "$lbl" ]]; then
            echo "❌ Blocked: missing required label: $lbl";
            echo "✅ Required labels: ${REQUIRED_LABELS[*]}";
            return 1;
        fi;
    done;
    echo "✅ Preflight passed. Required labels present.";
    echo "";
    read "CONFIRM?🚨 Merge PR #$PR into main? (y/n): ";
    if [[ "$CONFIRM" != "y" ]]; then
        echo "🛑 Merge cancelled.";
        return 0;
    fi;
    echo "";
    echo "🤠 Merging PR #$PR...";
    gh pr merge $PR --repo "$REPO" --merge --delete-branch;
    echo "✅ DONE — Spine merge complete."
}
MacBook-Pro:directors-console admin$ ab_spine_merge 41
🔎 Preflight check for PR #41 in AlligatorBrainProjects/directors-console...

📌 PR: #41 | Day 7 Kickoff: Ledger Lite scaffold folders
State: MERGED
Mergeable: UNKNOWN
Merge Status: UNKNOWN
Labels: 

❌ Blocked: PR is not OPEN (state=MERGED)
MacBook-Pro:directors-console admin$ gh pr list --repo AlligatorBrainProjects/directors-console --state open
no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ ab_spine_merge <open_pr_number>
-bash: syntax error near unexpected token newline'
MacBook-Pro:directors-console admin$ if [ "$STATE" = "MERGED" ]; then
>   echo "✅ PR already merged — nothing to do."
>   return 0
> fi
✅ PR already merged — nothing to do.
-bash: return: can only return' from a function or sourced script
MacBook-Pro:directors-console admin$ ab_spine_merge() {
>   PR=$1
>   REPO=${2:-AlligatorBrainProjects/directors-console}
> 
>   if [ -z "$PR" ]; then
>     echo "❌ Usage: ab_spine_merge <pr_number>"
>     return 1
>   fi
> 
>   echo "🔎 Preflight check for PR #$PR in $REPO..."
>   echo ""
> 
>   JSON=$(gh pr view $PR --repo "$REPO" --json number,title,labels,mergeable,state,mergeStateStatus 2>/dev/null)
> 
>   if [ -z "$JSON" ]; then
>     echo "❌ Could not fetch PR #$PR. Check number/repo."
>     return 1
>   fi
> 
>   TITLE=$(echo "$JSON" | jq -r '.title')
>   STATE=$(echo "$JSON" | jq -r '.state')
>   MERGE_STATUS=$(echo "$JSON" | jq -r '.mergeStateStatus')
>   LABELS=$(echo "$JSON" | jq -r '.labels[].name' | tr '\n' ' ')
> 
>   echo "📌 PR: #$PR | $TITLE"
>   echo "State: $STATE"
>   echo "Merge Status: $MERGE_STATUS"
>   echo "Labels: $LABELS"
>   echo ""
> 
>   # ✅ Already merged → no action
>   if [ "$STATE" = "MERGED" ]; then
>     echo "✅ PR already merged — nothing to do."
>     return 0
>   fi
> 
>   # Must be OPEN
>   if [ "$STATE" != "OPEN" ]; then
>     echo "❌ Blocked: PR is not OPEN (state=$STATE)"
>     return 1
>   fi
> 
>   # Merge must be CLEAN
>   if [ "$MERGE_STATUS" != "CLEAN" ]; then
>     echo "❌ Blocked: PR merge state is not clean (mergeStateStatus=$MERGE_STATUS)"
>     return 1
>   fi
> 
>   # Required labels
>   REQUIRED_LABELS=("spine-merge" "canon")
>   for lbl in "${REQUIRED_LABELS[@]}"; do
>     if [[ ! "$LABELS" =~ "$lbl" ]]; then
>       echo "❌ Blocked: missing required label: $lbl"
>       echo "✅ Required labels: ${REQUIRED_LABELS[*]}"
>       return 1
>     fi
>   done
> 
>   echo "✅ Preflight passed. Required labels present."
>   echo ""
> 
>   read "CONFIRM?🚨 Merge PR #$PR into main? (y/n): "
>   if [[ "$CONFIRM" != "y" ]]; then
>     echo "🛑 Merge cancelled."
>     return 0
>   fi
> 
>   echo ""
>   echo "🤠 Merging PR #$PR..."
>   gh pr merge $PR --repo "$REPO" --merge --delete-branch
> 
>   echo "✅ DONE — Spine merge complete."
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ jq --version
jq-1.7.1-apple
MacBook-Pro:directors-console admin$ ab_merge_latest_spine
-bash: ab_merge_latest_spine: command not found
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_merge_latest_spine
ab_merge_latest_spine is a function
ab_merge_latest_spine () 
{ 
    REPO=${1:-AlligatorBrainProjects/directors-console};
    PR=$(gh pr list --repo "$REPO" --state open --label "spine-merge" --limit 1 --json number -q '.[0].number');
    if [ -z "$PR" ] || [ "$PR" = "null" ]; then
        echo "✅ No open spine PRs found.";
        return 0;
    fi;
    echo "🤠 Found spine PR #$PR — running ab_spine_merge...";
    ab_spine_merge "$PR" "$REPO"
}
MacBook-Pro:directors-console admin$ ab_merge_latest_spine
✅ No open spine PRs found.
MacBook-Pro:directors-console admin$ gh pr list --repo AlligatorBrainProjects/directors-console --state open
no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ gh pr edit <PR#> --repo "$REPO" --add-label "spine-merge,canon"
-bash: PR#: No such file or directory
MacBook-Pro:directors-console admin$ cd /Users/admin/Dev/directors-console || exit 1
MacBook-Pro:directors-console admin$ git status
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	local_scratch/

nothing added to commit but untracked files present (use "git add" to track)
MacBook-Pro:directors-console admin$ git checkout main
Already on 'main'
Your branch is up to date with 'origin/main'.
MacBook-Pro:directors-console admin$ git pull
Already up to date.
MacBook-Pro:directors-console admin$ gh pr list --repo AlligatorBrainProjects/directors-console --state open
no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ ab_spine_label 52
-bash: ab_spine_label: command not found
MacBook-Pro:directors-console admin$ ab_spine_merge 52
🔎 Preflight check for PR #52 in AlligatorBrainProjects/directors-console...
❌ Could not fetch PR #52. Check number/repo.
MacBook-Pro:directors-console admin$ echo "local_scratch/" >> .gitignore
MacBook-Pro:directors-console admin$ git add .gitignore
MacBook-Pro:directors-console admin$ git commit -m "Ignore local_scratch folder"
[main a469047] Ignore local_scratch folder
 1 file changed, 1 insertion(+)
MacBook-Pro:directors-console admin$ git push
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 317 bytes | 317.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/AlligatorBrainProjects/directors-console.git
   29102ba..a469047  main -> main
MacBook-Pro:directors-console admin$ gh pr list --repo AlligatorBrainProjects/directors-console --state open
no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ git checkout -b day7-ledger-lite-spec
Switched to a new branch 'day7-ledger-lite-spec'
MacBook-Pro:directors-console admin$ mkdir -p canon/ledger_lite evidence/day7
MacBook-Pro:directors-console admin$ touch canon/ledger_lite/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ cp canon/ledger_lite/ledger_lite_spec_v0.1.md evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ nano canon/ledger_lite/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ perl -0777 -i -pe 's/\A/# Evidence Pack — Day 7\n\n**Artifact:** Ledger Lite Spec v0.1\n**Source:** Spine Call Sheet #36\n**Timestamp:** '"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"' UTC\n**Verification:** Draft created — pending review\n\n---\n\n/s' evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ cp canon/ledger_lite/ledger_lite_spec_v0.1.md evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ perl -0777 -i -pe 's/\A/# Evidence Pack — Day 7\n\n**Artifact:** Ledger Lite Spec v0.1\n**Source:** Spine Call Sheet #36\n**Timestamp:** '"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"' UTC\n**Verification:** Draft created — pending review\n\n---\n\n/s' evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ git add canon/ledger_lite/ledger_lite_spec_v0.1.md evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ git commit -m "Day 7 Spine: Ledger Lite Spec v0.1 + evidence"
[day7-ledger-lite-spec 216b550] Day 7 Spine: Ledger Lite Spec v0.1 + evidence
 2 files changed, 333 insertions(+)
 create mode 100644 canon/ledger_lite/ledger_lite_spec_v0.1.md
 create mode 100644 evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ git push --set-upstream origin day7-ledger-lite-spec
Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 8 threads
Compressing objects: 100% (8/8), done.
Writing objects: 100% (8/8), 2.62 KiB | 2.62 MiB/s, done.
Total 8 (delta 4), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (4/4), completed with 3 local objects.
remote: 
remote: Create a pull request for 'day7-ledger-lite-spec' on GitHub by visiting
remote:      https://github.com/AlligatorBrainProjects/directors-console/pull/new/day7-ledger-lite-spec
remote: 
To https://github.com/AlligatorBrainProjects/directors-console.git
 * [new branch]      day7-ledger-lite-spec -> day7-ledger-lite-spec
branch 'day7-ledger-lite-spec' set up to track 'origin/day7-ledger-lite-spec'.
MacBook-Pro:directors-console admin$ gh pr create \
>   --title "Day 7 (Spine): Ledger Lite Spec v0.1 + evidence" \
>   --body "Adds canonical Ledger Lite Spec v0.1 and Day 7 evidence pack. Foundation for Ledger Lite Pack A (#36–#40)." \
>   --base main \
>   --head day7-ledger-lite-spec

Creating pull request for day7-ledger-lite-spec into main in AlligatorBrainProjects/directors-console

https://github.com/AlligatorBrainProjects/directors-console/pull/43
MacBook-Pro:directors-console admin$ gh pr edit 43 --repo "AlligatorBrainProjects/directors-console" --add-label "spine-merge,canon,ledger-lite,foundation-pack,tier3-addon"
https://github.com/AlligatorBrainProjects/directors-console/pull/43
MacBook-Pro:directors-console admin$ ab_spine_merge 43
🔎 Preflight check for PR #43 in AlligatorBrainProjects/directors-console...

📌 PR: #43 | Day 7 (Spine): Ledger Lite Spec v0.1 + evidence
State: OPEN
Mergeable: MERGEABLE
Merge Status: CLEAN
Labels: canon spine-merge foundation-pack ledger-lite tier3-addon 

❌ Blocked: missing required label: spine-candidate
✅ Required labels: spine-candidate evidence-required
MacBook-Pro:directors-console admin$ gh pr edit 43 --repo "AlligatorBrainProjects/directors-console" \
>   --add-label "spine-candidate,evidence-required"
https://github.com/AlligatorBrainProjects/directors-console/pull/43
MacBook-Pro:directors-console admin$ ab_spine_merge 43
🔎 Preflight check for PR #43 in AlligatorBrainProjects/directors-console...

📌 PR: #43 | Day 7 (Spine): Ledger Lite Spec v0.1 + evidence
State: OPEN
Mergeable: MERGEABLE
Merge Status: CLEAN
Labels: canon evidence-required spine-merge foundation-pack ledger-lite tier3-addon spine-candidate 

✅ Preflight passed. Required labels present.

y
-bash: read: `CONFIRM?🚨 Merge PR #43 into main? (y/n): ': not a valid identifier
🛑 Merge cancelled.
MacBook-Pro:directors-console admin$ read -r -p "🚨 Merge PR #$PR into main? (y/n): " CONFIRM
🚨 Merge PR #43 into main? (y/n): y
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_spine_merge
ab_spine_merge is a function
ab_spine_merge () 
{ 
    PR=$1;
    REPO=${2:-AlligatorBrainProjects/directors-console};
    REQUIRED_LABELS=("spine-candidate" "evidence-required");
    if [ -z "$PR" ]; then
        echo "❌ Usage: ab_spine_merge <PR_NUMBER> [REPO]";
        return 1;
    fi;
    echo "🔎 Preflight check for PR #$PR in $REPO...";
    echo "";
    JSON=$(gh pr view "$PR" --repo "$REPO" --json number,title,labels,mergeable,state,mergeStateStatus 2>/dev/null);
    if [ -z "$JSON" ]; then
        echo "❌ Could not fetch PR #$PR. Check number/repo.";
        return 1;
    fi;
    TITLE=$(echo "$JSON" | jq -r '.title');
    STATE=$(echo "$JSON" | jq -r '.state');
    MERGEABLE=$(echo "$JSON" | jq -r '.mergeable');
    MERGE_STATUS=$(echo "$JSON" | jq -r '.mergeStateStatus');
    LABELS=$(echo "$JSON" | jq -r '.labels[].name' | tr '\n' ' ');
    echo "📌 PR: #$PR | $TITLE";
    echo "State: $STATE";
    echo "Mergeable: $MERGEABLE";
    echo "Merge Status: $MERGE_STATUS";
    echo "Labels: $LABELS";
    echo "";
    if [ "$STATE" = "MERGED" ]; then
        echo "✅ PR already merged — nothing to do.";
        return 0;
    fi;
    if [ "$STATE" != "OPEN" ]; then
        echo "❌ Blocked: PR is not OPEN (state=$STATE)";
        return 1;
    fi;
    if [ "$MERGEABLE" != "MERGEABLE" ]; then
        echo "❌ Blocked: PR not mergeable (mergeable=$MERGEABLE)";
        return 1;
    fi;
    if [ "$MERGE_STATUS" != "CLEAN" ] && [ "$MERGE_STATUS" != "HAS_HOOKS" ]; then
        echo "❌ Blocked: PR merge state not clean (mergeStateStatus=$MERGE_STATUS)";
        return 1;
    fi;
    for lbl in "${REQUIRED_LABELS[@]}";
    do
        if [[ ! "$LABELS" =~ "$lbl" ]]; then
            echo "❌ Blocked: missing required label: $lbl";
            echo "✅ Required labels: ${REQUIRED_LABELS[*]}";
            return 1;
        fi;
    done;
    echo "✅ Preflight passed. Required labels present.";
    echo "";
    read -r -p "🚨 Merge PR #$PR into main? (y/n): " CONFIRM;
    if [[ "$CONFIRM" != "y" ]]; then
        echo "🛑 Merge cancelled.";
        return 0;
    fi;
    echo "";
    echo "🤠 Merging PR #$PR...";
    gh pr merge "$PR" --repo "$REPO" --merge --delete-branch;
    echo "✅ DONE — Spine merge complete."
}
MacBook-Pro:directors-console admin$ type ab_merge_latest_spine
ab_merge_latest_spine is a function
ab_merge_latest_spine () 
{ 
    REPO=${1:-AlligatorBrainProjects/directors-console};
    PR=$(gh pr list --repo "$REPO" --state open --label "spine-merge" --limit 1 --json number -q '.[0].number');
    if [ -z "$PR" ] || [ "$PR" = "null" ]; then
        echo "✅ No open spine PRs found.";
        return 0;
    fi;
    echo "🤠 Found spine PR #$PR — running ab_spine_merge...";
    ab_spine_merge "$PR" "$REPO"
}
MacBook-Pro:directors-console admin$ type ab_spine_label
ab_spine_label is a function
ab_spine_label () 
{ 
    PR=$1;
    REPO=${2:-AlligatorBrainProjects/directors-console};
    if [ -z "$PR" ]; then
        echo "❌ Usage: ab_spine_label <PR_NUMBER> [REPO]";
        return 1;
    fi;
    echo "🏷️ Adding spine labels to PR #$PR...";
    gh pr edit "$PR" --repo "$REPO" --add-label "spine-merge,canon,spine-candidate,evidence-required" --add-label "foundation-pack,ledger-lite,tier3-addon" 2> /dev/null;
    echo "✅ Labels applied to PR #$PR"
}
MacBook-Pro:directors-console admin$ ab_pr_open
📌 Open PRs in AlligatorBrainProjects/directors-console:

Showing 1 of 1 open pull request in AlligatorBrainProjects/directors-console

ID   TITLE                            BRANCH                 CREATED AT         
#43  Day 7 (Spine): Ledger Lite S...  day7-ledger-lite-spec  about 7 minutes ago
MacBook-Pro:directors-console admin$ ab_spine_label 43
🏷️ Adding spine labels to PR #43...
https://github.com/AlligatorBrainProjects/directors-console/pull/43
✅ Labels applied to PR #43
MacBook-Pro:directors-console admin$ ab_spine_merge 43
🔎 Preflight check for PR #43 in AlligatorBrainProjects/directors-console...

📌 PR: #43 | Day 7 (Spine): Ledger Lite Spec v0.1 + evidence
State: OPEN
Mergeable: MERGEABLE
Merge Status: CLEAN
Labels: canon evidence-required spine-merge foundation-pack ledger-lite tier3-addon spine-candidate 

✅ Preflight passed. Required labels present.

🚨 Merge PR #43 into main? (y/n): y

🤠 Merging PR #43...
✓ Merged pull request AlligatorBrainProjects/directors-console#43 (Day 7 (Spine): Ledger Lite Spec v0.1 + evidence)
✓ Deleted remote branch day7-ledger-lite-spec
✅ DONE — Spine merge complete.
MacBook-Pro:directors-console admin$ ab_spine_prepare() {
>   PR=$1
>   REPO=${2:-AlligatorBrainProjects/directors-console}
>   HUB_ISSUE=${3:-36}
> 
>   if [ -z "$PR" ]; then
>     echo "❌ Usage: ab_spine_prepare <PR_NUMBER> [REPO] [HUB_ISSUE]"
>     return 1
>   fi
> 
>   echo "🤠 Preparing spine PR #$PR..."
> 
>   # 1) Apply required labels
>   ab_spine_label "$PR" "$REPO"
> 
>   # 2) Get PR URL + title
>   PR_URL=$(gh pr view "$PR" --repo "$REPO" --json url -q '.url')
>   TITLE=$(gh pr view "$PR" --repo "$REPO" --json title -q '.title')
> 
>   echo "✅ PR ready: $PR_URL"
> 
>   # 3) Comment into Hub Issue
>   gh issue comment "$HUB_ISSUE" --repo "$REPO" --body \
> "🔥 **Spine PR Prepared**
> - PR: $PR_URL
> - Title: $TITLE
> ✅ Labels applied + preflight ready."
> 
>   echo "✅ Hub updated: Issue #$HUB_ISSUE"
> 
>   # 4) Open PR in browser
>   gh pr view "$PR" --repo "$REPO" --web
> 
>   echo ""
>   echo "🚀 Next step:"
>   echo "ab_spine_merge $PR"
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_spine_prepare 44
🤠 Preparing spine PR #44...
🏷️ Adding spine labels to PR #44...
✅ Labels applied to PR #44
GraphQL: Could not resolve to a PullRequest with the number of 44. (repository.pullRequest)
GraphQL: Could not resolve to a PullRequest with the number of 44. (repository.pullRequest)
✅ PR ready: 
https://github.com/AlligatorBrainProjects/directors-console/issues/36#issuecomment-3707327514
✅ Hub updated: Issue #36
GraphQL: Could not resolve to a PullRequest with the number of 44. (repository.pullRequest)

🚀 Next step:
ab_spine_merge 44
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pr_open
📌 Open PRs in AlligatorBrainProjects/directors-console:

no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ ab_spine_prepare 43
🔎 Checking PR #43 exists...
✅ Found PR: https://github.com/AlligatorBrainProjects/directors-console/pull/43
🤠 Preparing spine PR #43...
🏷️ Applying spine labels to PR #43...
✅ Labels applied to PR #43
https://github.com/AlligatorBrainProjects/directors-console/issues/36#issuecomment-3707331925
✅ Hub updated: Issue #36
Opening https://github.com/AlligatorBrainProjects/directors-console/pull/43 in your browser.

🚀 Next step:
ab_spine_merge 43
MacBook-Pro:directors-console admin$ ab_spine_merge 43
🔎 Preflight check for PR #43 in AlligatorBrainProjects/directors-console...

📌 PR: #43 | Day 7 (Spine): Ledger Lite Spec v0.1 + evidence
State: MERGED
Mergeable: UNKNOWN
Merge Status: UNKNOWN
Labels: canon evidence-required spine-merge foundation-pack ledger-lite tier3-addon spine-candidate 

✅ PR already merged — nothing to do.
MacBook-Pro:directors-console admin$ ab_merge_latest_spine
✅ No open spine PRs found.
MacBook-Pro:directors-console admin$ ab_spine_next() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
> 
>   PR=$(gh pr list --repo "$REPO" --state open \
>     --label "spine-candidate" \
> 
> 
MacBook-Pro:directors-console admin$ ab_spine_next
MacBook-Pro:directors-console admin$ ab_spine_promote 47
-bash: ab_spine_promote: command not found
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_spine_next
ab_spine_next is a function
ab_spine_next () 
{ 
    REPO=${1:-AlligatorBrainProjects/directors-console};
    PR=$(gh pr list --repo "$REPO" --state open     --label "spine-candidate"     --label "evidence-required"     --limit 1 --json number -q '.[0].number');
    if [ -z "$PR" ] || [ "$PR" = "null" ]; then
        echo "✅ No open spine-candidate PRs found.";
        return 0;
    fi;
    echo "🤠 Next spine-candidate PR: #$PR";
    gh pr view "$PR" --repo "$REPO" --web
}
MacBook-Pro:directors-console admin$ type ab_spine_promote
ab_spine_promote is a function
ab_spine_promote () 
{ 
    PR=$1;
    REPO=${2:-AlligatorBrainProjects/directors-console};
    HUB_ISSUE=${3:-36};
    if [ -z "$PR" ]; then
        echo "❌ Usage: ab_spine_promote <PR_NUMBER> [REPO] [HUB_ISSUE]";
        return 1;
    fi;
    echo "🏷️ Promoting PR #$PR to spine-merge...";
    gh pr edit "$PR" --repo "$REPO" --add-label "spine-merge" > /dev/null;
    PR_URL=$(gh pr view "$PR" --repo "$REPO" --json url -q '.url');
    TITLE=$(gh pr view "$PR" --repo "$REPO" --json title -q '.title');
    gh issue comment "$HUB_ISSUE" --repo "$REPO" --body "🔥 **SPINE PROMOTED**
- PR: $PR_URL
- Title: $TITLE
✅ This PR is now marked as *today’s spine merge* (spine-merge).";
    echo "✅ Spine promoted + hub updated.";
    echo "🚀 Next step: ab_spine_merge $PR"
}
MacBook-Pro:directors-console admin$ ab_spine_next
✅ No open spine-candidate PRs found.
MacBook-Pro:directors-console admin$ ab_spine_next
✅ No open spine-candidate PRs found.
MacBook-Pro:directors-console admin$ ab_spine_promote <PR#>
-bash: syntax error near unexpected token `newline'
MacBook-Pro:directors-console admin$ ab_pr_open
📌 Open PRs in AlligatorBrainProjects/directors-console:

no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ gh pr list --repo AlligatorBrainProjects/directors-console --state open
no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ ab_spine_label <PR_NUMBER>
-bash: syntax error near unexpected token `newline'
MacBook-Pro:directors-console admin$ ab_spine_label 43
🏷️ Applying spine labels to PR #43...
✅ Labels applied to PR #43
MacBook-Pro:directors-console admin$ ab_pr_open
📌 Open PRs in AlligatorBrainProjects/directors-console:

no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ ab_spine_status() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
> 
>   echo "🤠 AB SPINE STATUS — $REPO"
>   echo "=============================="
>   echo ""
> 
>   # 1) Open PR count
>   OPEN_COUNT=$(gh pr list --repo "$REPO" --state open --json number -q 'length')
>   echo "📌 Open PRs: $OPEN_COUNT"
> 
>   if [ "$OPEN_COUNT" -eq 0 ]; then
>     echo "✅ Clean repo — no open PRs."
>     return 0
>   fi
> 
>   echo ""
> 
>   # 2) Find next spine candidate
>   PR=$(gh pr list --repo "$REPO" --state open \
>     --label "spine-candidate" \
>     --label "evidence-required" \
>     --limit 1 --json number -q '.[0].number')
> 
>   if [ -z "$PR" ] || [ "$PR" = "null" ]; then
>     echo "⚠️ No spine-candidate PR found."
>     echo "✅ Next move: open a PR + label with ab_spine_label <PR#>"
>     return 0
>   fi
> 
>   echo "🔥 Spine Candidate Found: PR #$PR"
>   echo ""
> 
>   # 3) Preflight check
>   JSON=$(gh pr view "$PR" --repo "$REPO" --json title,state,mergeable,mergeStateStatus,labels,url)
> 
>   TITLE=$(echo "$JSON" | jq -r '.title')
>   STATE=$(echo "$JSON" | jq -r '.state')
>   MERGEABLE=$(echo "$JSON" | jq -r '.mergeable')
>   MERGE_STATUS=$(echo "$JSON" | jq -r '.mergeStateStatus')
>   LABELS=$(echo "$JSON" | jq -r '.labels[].name' | tr '\n' ' ')
>   URL=$(echo "$JSON" | jq -r '.url')
> 
>   echo "📌 Title: $TITLE"
>   echo "State: $STATE"
>   echo "Mergeable: $MERGEABLE"
>   echo "Merge Status: $MERGE_STATUS"
>   echo "Labels: $LABELS"
>   echo ""
>   echo "🔗 $URL"
>   echo ""
> 
>   # 4) Decision logic
>   if [ "$STATE" != "OPEN" ]; then
>     echo "❌ Blocked: PR is not OPEN."
>     return 1
>   fi
> 
>   if [ "$MERGEABLE" != "MERGEABLE" ]; then
>     echo "❌ Blocked: PR not mergeable."
>     return 1
>   fi
> 
>   if [ "$MERGE_STATUS" != "CLEAN" ] && [ "$MERGE_STATUS" != "HAS_HOOKS" ]; then
>     echo "❌ Blocked: Merge Status not clean (mergeStateStatus=$MERGE_STATUS)">     return 1
>   fi
> 
>   echo "✅ READY TO MERGE"
>   echo "🚀 Next step:"
>   echo "ab_spine_merge $PR"
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_spine_status
🤠 AB SPINE STATUS — AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 0
✅ Clean repo — no open PRs.
MacBook-Pro:directors-console admin$ ab_pr_open
📌 Open PRs in AlligatorBrainProjects/directors-console:

no open pull requests in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ cd /Users/admin/Dev/directors-console || exit 1
MacBook-Pro:directors-console admin$ nano .github/ISSUE_TEMPLATE/call-sheet.md
MacBook-Pro:directors-console admin$ git checkout -b day3-call-sheet-template-label-preflight
Switched to a new branch 'day3-call-sheet-template-label-preflight'
MacBook-Pro:directors-console admin$ git add .github/ISSUE_TEMPLATE/call-sheet.md
MacBook-Pro:directors-console admin$ git commit -m "Patch Call Sheet template: add spine label + preflight requirement"
[day3-call-sheet-template-label-preflight f5ae4fa] Patch Call Sheet template: add spine label + preflight requirement
 1 file changed, 6 insertions(+)
MacBook-Pro:directors-console admin$ git push --set-upstream origin day3-call-sheet-template-label-preflight
Enumerating objects: 106, done.
Counting objects: 100% (106/106), done.
Delta compression using up to 8 threads
Compressing objects: 100% (58/58), done.
Writing objects: 100% (100/100), 24.62 KiB | 12.31 MiB/s, done.
Total 100 (delta 54), reused 65 (delta 32), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (54/54), completed with 5 local objects.
remote: 
remote: Create a pull request for 'day3-call-sheet-template-label-preflight' on GitHub by visiting:
remote:      https://github.com/AlligatorBrainProjects/directors-console/pull/new/day3-call-sheet-template-label-preflight
remote: 
To https://github.com/AlligatorBrainProjects/directors-console.git
 * [new branch]      day3-call-sheet-template-label-preflight -> day3-call-sheet-template-label-preflight
branch 'day3-call-sheet-template-label-preflight' set up to track 'origin/day3-call-sheet-template-label-preflight'.
MacBook-Pro:directors-console admin$ gh pr create \
>   --title "Day 3 (20%): Call Sheet template adds spine preflight + label check" \
>   --body "Adds required Spine merge preflight checklist to Call Sheet template to prevent label/evidence drift." \
>   --base main \
>   --head day3-call-sheet-template-label-preflight

Creating pull request for day3-call-sheet-template-label-preflight into main in AlligatorBrainProjects/directors-console

https://github.com/AlligatorBrainProjects/directors-console/pull/44
MacBook-Pro:directors-console admin$ ab_spine_label 44
🏷️ Applying spine labels to PR #44...
✅ Labels applied to PR #44
MacBook-Pro:directors-console admin$ ab_spine_merge 44
🔎 Preflight check for PR #44 in AlligatorBrainProjects/directors-console...

📌 PR: #44 | Day 3 (20%): Call Sheet template adds spine preflight + label check
State: OPEN
Mergeable: MERGEABLE
Merge Status: CLEAN
Labels: canon evidence-required spine-merge spine-candidate 

✅ Preflight passed. Required labels present.

🚨 Merge PR #44 into main? (y/n): y

🤠 Merging PR #44...
✓ Merged pull request AlligatorBrainProjects/directors-console#44 (Day 3 (20%): Call Sheet template adds spine preflight + label check)
✓ Deleted remote branch day3-call-sheet-template-label-preflight
✅ DONE — Spine merge complete.
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_spine_prepare
ab_spine_prepare is a function
ab_spine_prepare () 
{ 
    PR=$1;
    REPO=${2:-AlligatorBrainProjects/directors-console};
    HUB_ISSUE=${3:-36};
    if [ -z "$PR" ]; then
        echo "❌ Usage: ab_spine_prepare <PR_NUMBER> [REPO] [HUB_ISSUE]";
        return 1;
    fi;
    echo "🤠 Preparing spine PR #$PR...";
    echo "";
    JSON=$(gh pr view "$PR" --repo "$REPO" --json number,title,url,state 2>/dev/null);
    if [ -z "$JSON" ]; then
        echo "❌ PR #$PR not found in repo: $REPO";
        echo "✅ Run: ab_pr_open  (to list open PRs)";
        return 1;
    fi;
    TITLE=$(echo "$JSON" | jq -r '.title');
    PR_URL=$(echo "$JSON" | jq -r '.url');
    STATE=$(echo "$JSON" | jq -r '.state');
    echo "📌 Found PR: #$PR | $TITLE";
    echo "State: $STATE";
    echo "URL: $PR_URL";
    echo "";
    if [ "$STATE" != "OPEN" ]; then
        echo "❌ Blocked: PR is not OPEN (state=$STATE)";
        return 1;
    fi;
    ab_spine_label "$PR" "$REPO";
    gh issue comment "$HUB_ISSUE" --repo "$REPO" --body "🔥 **Spine PR Prepared**
- PR: $PR_URL
- Title: $TITLE
✅ Labels applied + preflight ready.";
    echo "✅ Hub updated: Issue #$HUB_ISSUE";
    gh pr view "$PR" --repo "$REPO" --web;
    echo "";
    echo "🚀 Next step:";
    echo "ab_spine_merge $PR"
}
MacBook-Pro:directors-console admin$ ab_spine_prepare 999
🤠 Preparing spine PR #999...

❌ PR #999 not found in repo: AlligatorBrainProjects/directors-console
✅ Run: ab_pr_open  (to list open PRs)
MacBook-Pro:directors-console admin$ ab_spine_candidate_open() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
> 
>   echo "🤠 Looking for next spine candidate in $REPO..."
>   echo ""
> 
>   PR=$(gh pr list --repo "$REPO" --state open \
>     --label "spine-candidate" \
>     --label "evidence-required" \
>     --limit 1 --json number -q '.[0].number')
> 
>   if [ -z "$PR" ] || [ "$PR" = "null" ]; then
>     echo "✅ No open spine-candidate PRs found."
>     return 0
>   fi
> 
>   TITLE=$(gh pr view "$PR" --repo "$REPO" --json title -q '.title')
>   URL=$(gh pr view "$PR" --repo "$REPO" --json url -q '.url')
> 
>   echo "🔥 Next spine candidate:"
>   echo "PR #$PR | $TITLE"
>   echo "$URL"
>   echo ""
> 
>   gh pr view "$PR" --repo "$REPO" --web
> 
>   echo ""
>   echo "🚀 Next step:"
>   echo "ab_spine_prepare $PR"
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_spine_candidate_open
ab_spine_candidate_open is a function
ab_spine_candidate_open () 
{ 
    REPO=${1:-AlligatorBrainProjects/directors-console};
    echo "🤠 Looking for next spine candidate in $REPO...";
    echo "";
    PR=$(gh pr list --repo "$REPO" --state open     --label "spine-candidate"     --label "evidence-required"     --limit 1 --json number -q '.[0].number');
    if [ -z "$PR" ] || [ "$PR" = "null" ]; then
        echo "✅ No open spine-candidate PRs found.";
        return 0;
    fi;
    TITLE=$(gh pr view "$PR" --repo "$REPO" --json title -q '.title');
    URL=$(gh pr view "$PR" --repo "$REPO" --json url -q '.url');
    echo "🔥 Next spine candidate:";
    echo "PR #$PR | $TITLE";
    echo "$URL";
    echo "";
    gh pr view "$PR" --repo "$REPO" --web;
    echo "";
    echo "🚀 Next step:";
    echo "ab_spine_prepare $PR"
}
MacBook-Pro:directors-console admin$ ab_spine_candidate_open
🤠 Looking for next spine candidate in AlligatorBrainProjects/directors-console...

✅ No open spine-candidate PRs found.
MacBook-Pro:directors-console admin$ ab_spine_pipeline() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
> 
>   echo "🤠 AB SPINE PIPELINE — $REPO"
>   echo "=============================="
>   echo ""
> 
>   OPEN_COUNT=$(gh pr list --repo "$REPO" --state open --json number -q 'length')
> 
>   echo "📌 Open PRs: $OPEN_COUNT"
>   echo ""
> 
>   if [ "$OPEN_COUNT" -eq 0 ]; then
>     echo "✅ Clean repo — no open PRs."
>     return 0
>   fi
> 
>   echo "🧠 SPINE MERGE PRs (label: spine-merge)"
>   gh pr list --repo "$REPO" --state open --label "spine-merge" --limit 10
>   echo ""
> 
>   echo "🔥 SPINE CANDIDATES (labels: spine-candidate + evidence-required)"
>   gh pr list --repo "$REPO" --state open --label "spine-candidate" --label "evidence-required" --limit 10
>   echo ""
> 
>   echo "🛠️ PARALLEL PRs (open PRs WITHOUT spine-merge label)"
>   gh pr list --repo "$REPO" --state open --search "-label:spine-merge" --limit 10
>   echo ""
> 
>   echo "✅ Recommended next action:"
>   NEXT=$(gh pr list --repo "$REPO" --state open --label "spine-candidate" --label "evidence-required" --limit 1 --json number -q '.[0].number')
> 
>   if [ -z "$NEXT" ] || [ "$NEXT" = "null" ]; then
>     echo "➡️ No spine candidates ready. Create or label one."
>   else
>     echo "➡️ ab_spine_prepare $NEXT"
>   fi
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_spine_pipeline
🤠 AB SPINE PIPELINE — AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 0

✅ Clean repo — no open PRs.
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_spine_pipeline
🤠 AB SPINE PIPELINE — AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 0
✅ No open PRs.

------------------------------
🧩 Pack A Issues (#36–#40)
------------------------------
🟡 #36 OPEN   — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
🟡 #37 OPEN   — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
🟡 #38 OPEN   — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
🟡 #39 OPEN   — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
🟡 #40 OPEN   — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules

------------------------------
🚀 Next Suggested Action
------------------------------
➡️ No spine candidates ready. Create or label one.
MacBook-Pro:directors-console admin$ ab_pack_status() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
>   echo "🐊 AB PACK STATUS — Pack A (#36–#40)"
>   echo "Repo: $REPO"
>   echo "=============================="
>   echo ""
> 
>   OPEN_COUNT=0
>   CLOSED_COUNT=0
> 
>   for i in 36 37 38 39 40; do
>     STATE=$(gh issue view "$i" --repo "$REPO" --json state -q '.state' 2>/dev/null)
>     TITLE=$(gh issue view "$i" --repo "$REPO" --json title -q '.title' 2>/dev/null)
> 
>     if [ -z "$STATE" ]; then
>       echo "❌ Issue #$i not found"
>       continue
>     fi
> 
>     if [ "$STATE" = "OPEN" ]; then
>       echo "🟡 #$i OPEN   — $TITLE"
>       OPEN_COUNT=$((OPEN_COUNT+1))
>     else
>       echo "✅ #$i CLOSED — $TITLE"
>       CLOSED_COUNT=$((CLOSED_COUNT+1))
>     fi
>   done
> 
>   echo ""
>   echo "✅ Closed: $CLOSED_COUNT | 🟡 Open: $OPEN_COUNT"
> }
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ ab_pack_open() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
>   echo "🟡 OPEN Pack A Issues (#36–#40)"
>   echo "Repo: $REPO"
>   echo "=============================="
>   echo ""
> 
>   for i in 36 37 38 39 40; do
>     STATE=$(gh issue view "$i" --repo "$REPO" --json state -q '.state' 2>/dev/null)
>     if [ "$STATE" = "OPEN" ]; then
>       TITLE=$(gh issue view "$i" --repo "$REPO" --json title -q '.title')
>       echo "🟡 #$i — $TITLE"
>     fi
>   done
> }
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ ab_pack_done() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
> 
>   OPEN_COUNT=0
>   for i in 36 37 38 39 40; do
>     STATE=$(gh issue view "$i" --repo "$REPO" --json state -q '.state' 2>/dev/null)
>     if [ "$STATE" = "OPEN" ]; then
>       OPEN_COUNT=$((OPEN_COUNT+1))
>     fi
>   done
> 
>   if [ "$OPEN_COUNT" -eq 0 ]; then
>     echo "✅ Pack A COMPLETE — all issues closed."
>   else
>     echo "🟡 Pack A NOT DONE — $OPEN_COUNT issue(s) still open."
>     echo "➡️ Run: ab_pack_open"
>   fi
> }
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ ab_pack_web() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
>   echo "🌐 Opening Pack A issues (#36–#40) in browser..."
>   for i in 36 37 38 39 40; do
>     gh issue view "$i" --repo "$REPO" --web
>   done
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_status
🐊 AB PACK STATUS — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

🟡 #36 OPEN   — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
🟡 #37 OPEN   — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
🟡 #38 OPEN   — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
🟡 #39 OPEN   — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
🟡 #40 OPEN   — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules

✅ Closed: 0 | 🟡 Open: 5
MacBook-Pro:directors-console admin$ ab_pack_open
🟡 OPEN Pack A Issues (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

🟡 #36 — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
🟡 #37 — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
🟡 #38 — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
🟡 #39 — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
🟡 #40 — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules
MacBook-Pro:directors-console admin$ ab_pack_ready() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
>   echo "🐊 AB PACK READY CHECK — Issue → PR Tracker (Pack A #36–#40)"
>   echo "Repo: $REPO"
>   echo "=============================="
>   echo ""
> 
>   for i in 36 37 38 39 40; do
>     TITLE=$(gh issue view "$i" --repo "$REPO" --json title -q '.title' 2>/dev/null)
> 
>     if [ -z "$TITLE" ]; then
>       echo "❌ Issue #$i not found"
>       continue
>     fi
> 
>     # Find PRs that mention the issue number
>     PRS=$(gh pr list --repo "$REPO" --state all \
>       --search "$i" \
>       --json number,title,url \
>       -q '.[] | "\(.number) | \(.title) | \(.url)"' 2>/dev/null)
> 
>     echo "------------------------------"
>     echo "🟡 Issue #$i — $TITLE"
>     echo "------------------------------"
> 
>     if [ -z "$PRS" ]; then
>       echo "❌ No PR found yet"
>       echo "➡️ Next action: build + PR for Issue #$i"
>     else
>       echo "✅ PR(s) found:"
>       echo "$PRS" | while IFS= read -r line; do
>         echo "  🔗 $line"
>       done
>     fi
> 
>     echo ""
>   done
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_ready
🐊 AB PACK READY CHECK — Issue → PR Tracker (Pack A #36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

------------------------------
🟡 Issue #36 — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
------------------------------
✅ PR(s) found:
  🔗 43 | Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

------------------------------
🟡 Issue #37 — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
------------------------------
❌ No PR found yet
➡️ Next action: build + PR for Issue #37

------------------------------
🟡 Issue #38 — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
------------------------------
❌ No PR found yet
➡️ Next action: build + PR for Issue #38

------------------------------
🟡 Issue #39 — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
------------------------------
❌ No PR found yet
➡️ Next action: build + PR for Issue #39

------------------------------
🟡 Issue #40 — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules
------------------------------
✅ PR(s) found:
  🔗 43 | Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

MacBook-Pro:directors-console admin$ ab_pack_rollcall() {
>   REPO=${1:-AlligatorBrainProjects/directors-console}
> 
>   echo "🐊 AB PACK ROLLCALL — Pack A (#36–#40)"
>   echo "Repo: $REPO"
>   echo "=============================="
>   echo ""
> 
>   # 1) PR Summary
>   OPEN_PRS=$(gh pr list --repo "$REPO" --state open --json number -q 'length')
>   echo "📌 Open PRs: $OPEN_PRS"
>   echo ""
> 
>   # 2) Pack A Issues Summary + PR links
>   OPEN_COUNT=0
>   CLOSED_COUNT=0
>   SPINE_NEXT=""
> 
>   echo "------------------------------"
>   echo "🧩 Pack A Issue → PR Status"
>   echo "------------------------------"
> 
>   for i in 36 37 38 39 40; do
>     JSON=$(gh issue view "$i" --repo "$REPO" --json title,state,url 2>/dev/null)
>     if [ -z "$JSON" ]; then
>       echo "❌ Issue #$i not found"
>       continue
>     fi
> 
>     TITLE=$(echo "$JSON" | jq -r '.title')
>     STATE=$(echo "$JSON" | jq -r '.state')
>     URL=$(echo "$JSON" | jq -r '.url')
> 
>     if [ "$STATE" = "OPEN" ]; then
>       ICON="🟡"
>       OPEN_COUNT=$((OPEN_COUNT+1))
>     else
>       ICON="✅"
>       CLOSED_COUNT=$((CLOSED_COUNT+1))
>     fi
> 
>     echo "$ICON #$i $STATE — $TITLE"
>     echo "   🔗 $URL"
> 
>     # Find PRs mentioning issue number
>     PRS=$(gh pr list --repo "$REPO" --state all \
>       --search "$i" \
>       --json number,title,url \
>       -q '.[] | "   ✅ PR #\(.number): \(.title) | \(.url)"' 2>/dev/null)
> 
>     if [ -z "$PRS" ]; then
>       echo "   ❌ No PR linked yet"
>     else
>       echo "$PRS"
>     fi
> 
>     echo ""
>   done
> 
>   # 3) Next spine candidate (if exists)
>   SPINE_NEXT=$(gh pr list --repo "$REPO" --state open \
>     --label "spine-candidate" \
>     --label "evidence-required" \
>     --limit 1 --json number -q '.[0].number' 2>/dev/null)
> 
>   echo "------------------------------"
>   echo "📌 Pack Summary"
>   echo "------------------------------"
>   echo "✅ Closed: $CLOSED_COUNT | 🟡 Open: $OPEN_COUNT"
>   echo ""
> 
>   echo "------------------------------"
>   echo "🚀 Next Suggested Action"
>   echo "------------------------------"
> 
>   if [ "$OPEN_PRS" -gt 0 ]; then
>     echo "➡️ You have open PRs. Run: ab_pr_open"
>   elif [ -n "$SPINE_NEXT" ] && [ "$SPINE_NEXT" != "null" ]; then
>     echo "➡️ Spine candidate ready: PR #$SPINE_NEXT"
>     echo "➡️ Run: ab_spine_prepare $SPINE_NEXT"
>   elif [ "$OPEN_COUNT" -gt 0 ]; then
>     echo "➡️ Build next Pack A issue (start with #37) → open PR"
>     echo "➡️ Then run: ab_spine_label <PR#> or ab_spine_prepare <PR#>"
>   else
>     echo "✅ Pack A complete. Ready for next Pack."
>   fi
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_rollcall
🐊 AB PACK ROLLCALL — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 0

------------------------------
🧩 Pack A Issue → PR Status
------------------------------
🟡 #36 OPEN — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/36
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

🟡 #37 OPEN — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/37
   ❌ No PR linked yet

🟡 #38 OPEN — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/38
   ❌ No PR linked yet

🟡 #39 OPEN — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/39
   ❌ No PR linked yet

🟡 #40 OPEN — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/40
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

------------------------------
📌 Pack Summary
------------------------------
✅ Closed: 0 | 🟡 Open: 5

------------------------------
🚀 Next Suggested Action
------------------------------
➡️ Build next Pack A issue (start with #37) → open PR
➡️ Then run: ab_spine_label <PR#> or ab_spine_prepare <PR#>
MacBook-Pro:directors-console admin$ ab_pack_start() {
>   ISSUE=$1
>   REPO=${2:-AlligatorBrainProjects/directors-console}
> 
>   if [ -z "$ISSUE" ]; then
>     echo "❌ Usage: ab_pack_start <ISSUE_NUMBER> [REPO]"
>     return 1
>   fi
> 
>   echo "🐊 Starting Pack A Issue #$ISSUE..."
>   echo ""
> 
>   # 1) Verify issue exists
>   JSON=$(gh issue view "$ISSUE" --repo "$REPO" --json title,state,url 2>/dev/null)
>   if [ -z "$JSON" ]; then
>     echo "❌ Issue #$ISSUE not found in repo: $REPO"
>     return 1
>   fi
> 
>   TITLE=$(echo "$JSON" | jq -r '.title')
>   STATE=$(echo "$JSON" | jq -r '.state')
>   URL=$(echo "$JSON" | jq -r '.url')
> 
>   echo "📌 Issue: #$ISSUE | $TITLE"
>   echo "State: $STATE"
>   echo "URL: $URL"
>   echo ""
> 
>   if [ "$STATE" != "OPEN" ]; then
>     echo "❌ Blocked: Issue is not OPEN (state=$STATE)"
>     return 1
>   fi
> 
>   # 2) Create safe branch name
>   SAFE_TITLE=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-|-$//g' | cut -c1-45)
>   BRANCH="day7-issue${ISSUE}-${SAFE_TITLE}"
> 
>   echo "🌿 Creating branch: $BRANCH"
>   git checkout -b "$BRANCH" || return 1
>   echo ""
> 
>   # 3) Open issue in browser
>   echo "🌐 Opening issue in browser..."
>   gh issue view "$ISSUE" --repo "$REPO" --web
>   echo ""
> 
>   # 4) Ensure evidence folder exists
>   mkdir -p "evidence/day7"
>   echo "✅ Ensured evidence/day7 exists"
>   echo ""
> 
>   # 5) Print next exact steps
>   echo "------------------------------"
>   echo "🚀 NEXT STEPS (copy/paste)"
>   echo "------------------------------"
>   echo "1) Build your deliverable for Issue #$ISSUE"
>   echo "2) Put Canon artifact in canon/... (if needed)"
>   echo "3) Copy evidence to evidence/day7/..."
>   echo ""
>   echo "Then:"
>   echo "git status"
>   echo "git add <files>"
>   echo "git commit -m \"Day 7: Issue #$ISSUE — <short title> + evidence\""
>   echo "git push --set-upstream origin \"$BRANCH\""
>   echo ""
>   echo "Then open PR:"
>   echo "gh pr create --title \"Day 7: Issue #$ISSUE — <short title>\" --body \"Closes #$ISSUE. Includes evidence.\" --base main --head \"$BRANCH\""
>   echo ""
>   echo "Then label it:"
>   echo "ab_spine_label <PR#>"
>   echo ""
>   echo "Then merge (if Spine candidate):"
>   echo "ab_spine_merge <PR#>"
>   echo ""
> }
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_start 37
🐊 Starting Pack A Issue #37...

📌 Issue: #37 | Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/issues/37

🌿 Creating branch: day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
Switched to a new branch 'day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e'

🌐 Opening issue in browser...
Opening https://github.com/AlligatorBrainProjects/directors-console/issues/37 in your browser.

✅ Ensured evidence/day7 exists

------------------------------
🚀 NEXT STEPS (copy/paste)
------------------------------
1) Build your deliverable for Issue #37
2) Put Canon artifact in canon/... (if needed)
3) Copy evidence to evidence/day7/...

Then:
git status
git add <files>
git commit -m "Day 7: Issue #37 — <short title> + evidence"
git push --set-upstream origin "day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e"

Then open PR:
gh pr create --title "Day 7: Issue #37 — <short title>" --body "Closes #37. Includes evidence." --base main --head "day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e"

Then label it:
ab_spine_label <PR#>

Then merge (if Spine candidate):
ab_spine_merge <PR#>

MacBook-Pro:directors-console admin$ cd /Users/admin/Dev/directors-console || exit 1
MacBook-Pro:directors-console admin$ git checkout main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
MacBook-Pro:directors-console admin$ git pull
remote: Enumerating objects: 2, done.
remote: Counting objects: 100% (2/2), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 2 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (2/2), 1.84 KiB | 314.00 KiB/s, done.
From https://github.com/AlligatorBrainProjects/directors-console
   a469047..f8d2a3e  main       -> origin/main
Updating a469047..f8d2a3e
Fast-forward
 .github/ISSUE_TEMPLATE/call-sheet.md       |   6 +
 canon/ledger_lite/ledger_lite_spec_v0.1.md | 162 +++++++++++++++++++++++++++
 evidence/day7/ledger_lite_spec_v0.1.md     | 171 +++++++++++++++++++++++++++++
 3 files changed, 339 insertions(+)
 create mode 100644 canon/ledger_lite/ledger_lite_spec_v0.1.md
 create mode 100644 evidence/day7/ledger_lite_spec_v0.1.md
MacBook-Pro:directors-console admin$ ab_pack_start 37
🐊 Starting Pack A Issue #37...

📌 Issue: #37 | Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/issues/37

🌿 Creating branch: day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
fatal: a branch named 'day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e' already exists
MacBook-Pro:directors-console admin$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
MacBook-Pro:directors-console admin$ git branch --show-current
main
MacBook-Pro:directors-console admin$ git branch | grep issue37
  day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
MacBook-Pro:directors-console admin$ git checkout day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
Switched to branch 'day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e'
MacBook-Pro:directors-console admin$ git branch --show-current
day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
MacBook-Pro:directors-console admin$ git status
On branch day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
nothing to commit, working tree clean
MacBook-Pro:directors-console admin$ git log -1 --oneline
f5ae4fa (HEAD -> day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e, origin/day3-call-sheet-template-label-preflight, day3-call-sheet-template-label-preflight) Patch Call Sheet template: add spine label + preflight requirement
MacBook-Pro:directors-console admin$ git fetch origin
MacBook-Pro:directors-console admin$ git merge origin/main
Updating f5ae4fa..f8d2a3e
Fast-forward
MacBook-Pro:directors-console admin$ git status
On branch day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
nothing to commit, working tree clean
MacBook-Pro:directors-console admin$ git branch --show-current
day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
MacBook-Pro:directors-console admin$ git log -1 --oneline
f8d2a3e (HEAD -> day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e, origin/main, origin/HEAD, main) Merge pull request #44 from AlligatorBrainProjects/day3-call-sheet-template-label-preflight
MacBook-Pro:directors-console admin$ mkdir -p canon/ledger_lite/ui
MacBook-Pro:directors-console admin$ mkdir -p evidence/day7/issue37
MacBook-Pro:directors-console admin$ nano canon/ledger_lite/ui/income_expense_entry_ui_mvp_v0.1.md
MacBook-Pro:directors-console admin$ cp canon/ledger_lite/ui/income_expense_entry_ui_mvp_v0.1.md evidence/day7/issue37/income_expense_entry_ui_mvp_v0.1.md
MacBook-Pro:directors-console admin$ perl -0777 -i -pe 's/\A/# Evidence Pack — Day 7 (Issue #37)\n\n**Artifact:** Income + Expense Entry UI (MVP) v0.1\n**Source:** Call Sheet #37\n**Timestamp:** '"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"' UTC\n**Verification:** Draft created — pending implementation\n\n---\n\n/s' evidence/day7/issue37/income_expense_entry_ui_mvp_v0.1.md
MacBook-Pro:directors-console admin$ git add canon/ledger_lite/ui/income_expense_entry_ui_mvp_v0.1.md evidence/day7/issue37/income_expense_entry_ui_mvp_v0.1.md
MacBook-Pro:directors-console admin$ git commit -m "Day 7 Issue #37: Income + Expense Entry UI MVP spec v0.1 + evidence stub"
[day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e c9944ae] Day 7 Issue #37: Income + Expense Entry UI MVP spec v0.1 + evidence stub
 2 files changed, 97 insertions(+)
 create mode 100644 canon/ledger_lite/ui/income_expense_entry_ui_mvp_v0.1.md
 create mode 100644 evidence/day7/issue37/income_expense_entry_ui_mvp_v0.1.md
MacBook-Pro:directors-console admin$ git push --set-upstream origin day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Delta compression using up to 8 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (10/10), 1.40 KiB | 1.40 MiB/s, done.
Total 10 (delta 6), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (6/6), completed with 5 local objects.
remote: 
remote: Create a pull request for 'day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e' on GitHub by visiting:
remote:      https://github.com/AlligatorBrainProjects/directors-console/pull/new/day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
remote: 
To https://github.com/AlligatorBrainProjects/directors-console.git
 * [new branch]      day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e -> day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
branch 'day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e' set up to track 'origin/day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e'.
MacBook-Pro:directors-console admin$ git status
On branch day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e
Your branch is up to date with 'origin/day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e'.

nothing to commit, working tree clean
MacBook-Pro:directors-console admin$ git --no-pager log -1 --oneline
c9944ae (HEAD -> day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e, origin/day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e) Day 7 Issue #37: Income + Expense Entry UI MVP spec v0.1 + evidence stub
MacBook-Pro:directors-console admin$ gh pr create \
>   --title "Day 7 (Parallel): Issue #37 — Income + Expense Entry UI MVP spec v0.1 + evidence" \
>   --body "Adds canonical MVP spec for Income + Expense Entry UI and Day 7 evidence stub. Supports Issue #37 execution." \
>   --base main \
>   --head day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e

Creating pull request for day7-issue37-call-sheet-day-7-ledger-lite-income-expense-e into main in AlligatorBrainProjects/directors-console

https://github.com/AlligatorBrainProjects/directors-console/pull/45
MacBook-Pro:directors-console admin$ gh pr edit <PR#> --repo "AlligatorBrainProjects/directors-console" \
>   --add-label "parallel,cannon,canon,evidence-required,ledger-lite,foundation-pack,tier3-addon"
-bash: PR#: No such file or directory
MacBook-Pro:directors-console admin$ gh pr edit 45 --repo "AlligatorBrainProjects/directors-console" \
>   --add-label "parallel,canon,evidence-required,ledger-lite,foundation-pack,tier3-addon"
'parallel' not found
MacBook-Pro:directors-console admin$ gh label create "parallel" --repo "AlligatorBrainProjects/directors-console" \
>   --description "Parallel work PR (not spine merge)" \
>   --color "0E8A16" || true
✓ Label "parallel" created in AlligatorBrainProjects/directors-console
MacBook-Pro:directors-console admin$ gh pr edit 45 --repo "AlligatorBrainProjects/directors-console" \
>   --add-label "parallel,canon,evidence-required,ledger-lite,foundation-pack,tier3-addon"
https://github.com/AlligatorBrainProjects/directors-console/pull/45
MacBook-Pro:directors-console admin$ gh pr view 45 --repo "AlligatorBrainProjects/directors-console" --json labels -q '.labels[].name'
canon
evidence-required
foundation-pack
ledger-lite
tier3-addon
parallel
MacBook-Pro:directors-console admin$ gh label create "spine-candidate" --repo "AlligatorBrainProjects/directors-console" \
>   --description "Candidate PR for today’s spine merge" \
>   --color "FBCA04" || true
label with name "spine-candidate" already exists; use --force to update its color and description
MacBook-Pro:directors-console admin$ gh issue comment 37 --repo "AlligatorBrainProjects/directors-console" --body \
> "✅ **Parallel PR opened for Issue #37**
> - PR: https://github.com/AlligatorBrainProjects/directors-console/pull/45
> - Labels: parallel + canon + evidence-required
> - Artifact: \canon/ledger_lite/ui/income_expense_entry_ui_mvp_v0.1.md\
> - Evidence: \evidence/day7/issue37/income_expense_entry_ui_mvp_v0.1.md\"
https://github.com/AlligatorBrainProjects/directors-console/issues/37#issuecomment-3707363763
MacBook-Pro:directors-console admin$ ab_pack_rollcall
🐊 AB PACK ROLLCALL — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 1

------------------------------
🧩 Pack A Issue → PR Status
------------------------------
🟡 #36 OPEN — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/36
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

🟡 #37 OPEN — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/37
   ✅ PR #45: Day 7 (Parallel): Issue #37 — Income + Expense Entry UI MVP spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/45

🟡 #38 OPEN — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/38
   ❌ No PR linked yet

🟡 #39 OPEN — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/39
   ❌ No PR linked yet

🟡 #40 OPEN — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/40
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

------------------------------
📌 Pack Summary
------------------------------
✅ Closed: 0 | 🟡 Open: 5

------------------------------
🚀 Next Suggested Action
------------------------------
➡️ You have open PRs. Run: ab_pr_open
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ type ab_parallel_label
ab_parallel_label is a function
ab_parallel_label () 
{ 
    PR=$1;
    REPO=${2:-AlligatorBrainProjects/directors-console};
    ISSUE=${3:-""};
    if [ -z "$PR" ]; then
        echo "❌ Usage: ab_parallel_label <PR_NUMBER> [REPO] [ISSUE#]";
        echo "✅ Example: ab_parallel_label 45";
        echo "✅ Example: ab_parallel_label 45 AlligatorBrainProjects/directors-console 37";
        return 1;
    fi;
    echo "🏷️ PARALLEL LABELER — PR #$PR";
    echo "Repo: $REPO";
    echo "==============================";
    echo "";
    JSON=$(gh pr view "$PR" --repo "$REPO" --json number,title,url,state 2>/dev/null);
    if [ -z "$JSON" ]; then
        echo "❌ PR #$PR not found in repo: $REPO";
        echo "✅ Run: ab_pr_open";
        return 1;
    fi;
    TITLE=$(echo "$JSON" | jq -r '.title');
    URL=$(echo "$JSON" | jq -r '.url');
    STATE=$(echo "$JSON" | jq -r '.state');
    echo "📌 Found PR: #$PR | $TITLE";
    echo "State: $STATE";
    echo "URL: $URL";
    echo "";
    if [ "$STATE" != "OPEN" ]; then
        echo "❌ Blocked: PR is not OPEN (state=$STATE)";
        return 1;
    fi;
    echo "✅ Applying labels...";
    gh pr edit "$PR" --repo "$REPO" --add-label "parallel,canon,evidence-required,ledger-lite,foundation-pack,tier3-addon" > /dev/null;
    echo "✅ Labels applied.";
    if [ -z "$ISSUE" ]; then
        ISSUE=$(echo "$TITLE" | grep -oE '#[0-9]+' | head -n 1 | tr -d '#');
    fi;
    if [ -n "$ISSUE" ]; then
        echo "";
        echo "🧩 Linking to Issue #$ISSUE...";
        gh issue comment "$ISSUE" --repo "$REPO" --body "✅ **Parallel PR opened**
- PR: $URL
- Title: $TITLE
- Labels: parallel + canon + evidence-required
✅ This PR is queued as *Parallel work* (not spine merge)." > /dev/null;
        echo "✅ Issue updated: #$ISSUE";
    else
        echo "";
        echo "⚠️ No Issue number provided or detected.";
        echo "✅ You can run: ab_parallel_label $PR $REPO <ISSUE#>";
    fi;
    echo "";
    echo "🚀 Next steps:";
    echo "➡️ Review PR: gh pr view $PR --repo \"$REPO\" --web";
    echo "➡️ Keep it parallel until promoted."
}
MacBook-Pro:directors-console admin$ ab_parallel_label 45 AlligatorBrainProjects/directors-console 37
🏷️ PARALLEL LABELER — PR #45
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Found PR: #45 | Day 7 (Parallel): Issue #37 — Income + Expense Entry UI MVP spec v0.1 + evidence
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/pull/45

✅ Applying labels...
✅ Labels applied.

🧩 Linking to Issue #37...
✅ Issue updated: #37

🚀 Next steps:
➡️ Review PR: gh pr view 45 --repo "AlligatorBrainProjects/directors-console" --web
➡️ Keep it parallel until promoted.
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_next
🐊 AB PACK NEXT — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

✅ NEXT UP: Issue #38
🟡 Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)

🚀 Run:
➡️ ab_pack_start 38
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_next_auto
🐊 AB PACK NEXT AUTO — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

✅ NEXT UP: Issue #36
🟡 Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]

🚀 Suggested command:
➡️ ab_pack_start 36

🤠 Run ab_pack_start 36 now? (y/n): n 
🛑 Cancelled.
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_pack_next_auto
🐊 AB PACK NEXT AUTO — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

✅ NEXT UP: Issue #38
🟡 Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)

🚀 Suggested command:
➡️ ab_pack_start 38

🤠 Run ab_pack_start 38 now? (y/n): y

🐊 Starting Pack A Issue #38...

📌 Issue: #38 | Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/issues/38

🌿 Creating branch: day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
Switched to a new branch 'day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-'

🌐 Opening issue in browser...
Opening https://github.com/AlligatorBrainProjects/directors-console/issues/38 in your browser.

✅ Ensured evidence/day7 exists

------------------------------
🚀 NEXT STEPS (copy/paste)
------------------------------
1) Build your deliverable for Issue #38
2) Put Canon artifact in canon/... (if needed)
3) Copy evidence to evidence/day7/...

Then:
git status
git add <files>
git commit -m "Day 7: Issue #38 — <short title> + evidence"
git push --set-upstream origin "day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-"

Then open PR:
gh pr create --title "Day 7: Issue #38 — <short title>" --body "Closes #38. Includes evidence." --base main --head "day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-"

Then label it:
ab_spine_label <PR#>

Then merge (if Spine candidate):
ab_spine_merge <PR#>

MacBook-Pro:directors-console admin$ git branch --show-current
day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
MacBook-Pro:directors-console admin$ mkdir -p canon/ledger_lite/receipt_capture
MacBook-Pro:directors-console admin$ mkdir -p evidence/day7/issue38
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ nano canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ git add canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md \
>         evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
fatal: pathspec 'evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md' did not match any files
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ git commit -m "Day 7 Issue #38: Receipt Capture Photo→OCR→Entry spec v0.1 + evidence stub"
On branch day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	canon/ledger_lite/receipt_capture/

nothing added to commit but untracked files present (use "git add" to track)
MacBook-Pro:directors-console admin$ git push --set-upstream origin "$(git branch --show-current)"
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
remote: 
remote: Create a pull request for 'day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-' on GitHub by visiting:
remote:      https://github.com/AlligatorBrainProjects/directors-console/pull/new/day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
remote: 
To https://github.com/AlligatorBrainProjects/directors-console.git
 * [new branch]      day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture- -> day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
branch 'day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-' set up to track 'origin/day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-'.
MacBook-Pro:directors-console admin$ gh pr create \
>   --title "Day 7 (Parallel): Issue #38 — Receipt Capture Photo→OCR→Entry spec v0.1 + evidence" \
>   --body "Closes #38. Adds canonical Receipt Capture spec v0.1 and Day 7 evidence stub." \
>   --base main \
>   --head "$(git branch --show-current)"

Creating pull request for day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture- into main in AlligatorBrainProjects/directors-console

https://github.com/AlligatorBrainProjects/directors-console/pull/46
MacBook-Pro:directors-console admin$ ab_parallel_label <PR#> AlligatorBrainProjects/directors-console 38
-bash: PR#: No such file or directory
MacBook-Pro:directors-console admin$ git branch --show-current
day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
MacBook-Pro:directors-console admin$ cp canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md \
>    evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ perl -0777 -i -pe 's/\A/# Evidence Pack — Day 7 (Issue #38)\n\n**Artifact:** Receipt Capture (Photo → OCR → Entry) v0.1\n**Source:** Call Sheet #38\n**Timestamp:** '"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"' UTC\n**Verification:** Draft created — pending implementation\n\n---\n\n/s' \
> evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ git add canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md \
>         evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ git commit -m "Day 7 Issue #38: Receipt Capture Photo→OCR→Entry spec v0.1 + evidence stub"
[day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture- 64f5759] Day 7 Issue #38: Receipt Capture Photo→OCR→Entry spec v0.1 + evidence stub
 2 files changed, 15 insertions(+)
 create mode 100644 canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md
 create mode 100644 evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ git push
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Delta compression using up to 8 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (10/10), 1.20 KiB | 1.20 MiB/s, done.
Total 10 (delta 5), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (5/5), completed with 4 local objects.
To https://github.com/AlligatorBrainProjects/directors-console.git
   c9944ae..64f5759  day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture- -> day7-issue38-call-sheet-day-7-ledger-lite-receipt-capture-
MacBook-Pro:directors-console admin$ ab_parallel_label 46 AlligatorBrainProjects/directors-console 38
🏷️ PARALLEL LABELER — PR #46
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Found PR: #46 | Day 7 (Parallel): Issue #38 — Receipt Capture Photo→OCR→Entry spec v0.1 + evidence
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/pull/46

✅ Applying labels...
✅ Labels applied.

🧩 Linking to Issue #38...
✅ Issue updated: #38

🚀 Next steps:
➡️ Review PR: gh pr view 46 --repo "AlligatorBrainProjects/directors-console" --web
➡️ Keep it parallel until promoted.
MacBook-Pro:directors-console admin$ cp canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md \
>    evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ head -n 15 evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
cp canon/ledger_lite/receipt_capture/receipt_capture_photo_to_ocr_to_entry_v0.1.md evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md

perl -0777 -i -pe 's/\A/# Evidence Pack — Day 7 (Issue #38)\n\n**Artifact:** Receipt Capture (Photo → OCR → Entry) v0.1\n**Source:** Call Sheet #38\n**Timestamp:** '"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"' UTC\n**Verification:** Draft created — pending implementation\n\n---\n\n/s' evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ ab_pack_rollcall
🐊 AB PACK ROLLCALL — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 2

------------------------------
🧩 Pack A Issue → PR Status
------------------------------
🟡 #36 OPEN — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/36
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

🟡 #37 OPEN — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/37
   ✅ PR #45: Day 7 (Parallel): Issue #37 — Income + Expense Entry UI MVP spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/45

🟡 #38 OPEN — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/38
   ✅ PR #46: Day 7 (Parallel): Issue #38 — Receipt Capture Photo→OCR→Entry spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/46

🟡 #39 OPEN — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/39
   ❌ No PR linked yet

🟡 #40 OPEN — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/40
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

------------------------------
📌 Pack Summary
------------------------------
✅ Closed: 0 | 🟡 Open: 5

------------------------------
🚀 Next Suggested Action
------------------------------
➡️ You have open PRs. Run: ab_pr_open
MacBook-Pro:directors-console admin$ ab_pr_open
📌 Open PRs in AlligatorBrainProjects/directors-console:

Showing 2 of 2 open pull requests in AlligatorBrainProjects/directors-console

ID   TITLE                         BRANCH                   CREATED AT          
#46  Day 7 (Parallel): Issue #...  day7-issue38-call-sh...  about 7 minutes ago
#45  Day 7 (Parallel): Issue #...  day7-issue37-call-sh...  about 32 minutes ago
MacBook-Pro:directors-console admin$ ab_pack_next_auto
🐊 AB PACK NEXT AUTO — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

✅ NEXT UP: Issue #39
🟡 Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)

🚀 Suggested command:
➡️ ab_pack_start 39

🤠 Run ab_pack_start 39 now? (y/n): y

🐊 Starting Pack A Issue #39...

📌 Issue: #39 | Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/issues/39

🌿 Creating branch: day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
Switched to a new branch 'day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-'

🌐 Opening issue in browser...
Opening https://github.com/AlligatorBrainProjects/directors-console/issues/39 in your browser.

✅ Ensured evidence/day7 exists

------------------------------
🚀 NEXT STEPS (copy/paste)
------------------------------
1) Build your deliverable for Issue #39
2) Put Canon artifact in canon/... (if needed)
3) Copy evidence to evidence/day7/...

Then:
git status
git add <files>
git commit -m "Day 7: Issue #39 — <short title> + evidence"
git push --set-upstream origin "day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-"

Then open PR:
gh pr create --title "Day 7: Issue #39 — <short title>" --body "Closes #39. Includes evidence." --base main --head "day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-"

Then label it:
ab_spine_label <PR#>

Then merge (if Spine candidate):
ab_spine_merge <PR#>

MacBook-Pro:directors-console admin$ git branch --show-current
day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
MacBook-Pro:directors-console admin$ mkdir -p canon/ledger_lite/export_pack
MacBook-Pro:directors-console admin$ mkdir -p evidence/day7/issue39
MacBook-Pro:directors-console admin$ nano canon/ledger_lite/export_pack/export_pack_csv_accountant_bundle_v0.1.md
MacBook-Pro:directors-console admin$ git add canon/ledger_lite/export_pack/export_pack_csv_accountant_bundle_v0.1.md \
>         evidence/day7/issue39/export_pack_csv_accountant_bundle_v0.1.md
fatal: pathspec 'evidence/day7/issue39/export_pack_csv_accountant_bundle_v0.1.md' did not match any files
MacBook-Pro:directors-console admin$ 
MacBook-Pro:directors-console admin$ git commit -m "Day 7 Issue #39: Export Pack CSV + Accountant Bundle spec v0.1 + evidence stub"
On branch day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	canon/ledger_lite/export_pack/

no changes added to commit (use "git add" and/or "git commit -a")
MacBook-Pro:directors-console admin$ git push --set-upstream origin "$(git branch --show-current)"
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
remote: 
remote: Create a pull request for 'day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-' on GitHub by visiting:
remote:      https://github.com/AlligatorBrainProjects/directors-console/pull/new/day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
remote: 
To https://github.com/AlligatorBrainProjects/directors-console.git
 * [new branch]      day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv- -> day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
branch 'day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-' set up to track 'origin/day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-'.
MacBook-Pro:directors-console admin$ gh pr create \
>   --title "Day 7 (Parallel): Issue #39 — Export Pack (CSV + Accountant Bundle) spec v0.1 + evidence" \
>   --body "Closes #39. Adds canonical Export Pack spec v0.1 and Day 7 evidence stub." \
>   --base main \
>   --head "$(git branch --show-current)"

Creating pull request for day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv- into main in AlligatorBrainProjects/directors-console

https://github.com/AlligatorBrainProjects/directors-console/pull/47
MacBook-Pro:directors-console admin$ ab_parallel_label <PR#> AlligatorBrainProjects/directors-console 39
-bash: PR#: No such file or directory
MacBook-Pro:directors-console admin$ ab_parallel_label 47 AlligatorBrainProjects/directors-console 39
🏷️ PARALLEL LABELER — PR #47
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Found PR: #47 | Day 7 (Parallel): Issue #39 — Export Pack (CSV + Accountant Bundle) spec v0.1 + evidence
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/pull/47

✅ Applying labels...
✅ Labels applied.

🧩 Linking to Issue #39...
✅ Issue updated: #39

🚀 Next steps:
➡️ Review PR: gh pr view 47 --repo "AlligatorBrainProjects/directors-console" --web
➡️ Keep it parallel until promoted.
MacBook-Pro:directors-console admin$ git restore evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ git status
On branch day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
Your branch is up to date with 'origin/day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	canon/ledger_lite/export_pack/

nothing added to commit but untracked files present (use "git add" to track)
MacBook-Pro:directors-console admin$ ab_parallel_label 47 AlligatorBrainProjects/directors-console 39
🏷️ PARALLEL LABELER — PR #47
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Found PR: #47 | Day 7 (Parallel): Issue #39 — Export Pack (CSV + Accountant Bundle) spec v0.1 + evidence
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/pull/47

✅ Applying labels...
✅ Labels applied.

🧩 Linking to Issue #39...
✅ Issue updated: #39

🚀 Next steps:
➡️ Review PR: gh pr view 47 --repo "AlligatorBrainProjects/directors-console" --web
➡️ Keep it parallel until promoted.
MacBook-Pro:directors-console admin$ git restore evidence/day7/issue38/receipt_capture_photo_to_ocr_to_entry_v0.1.md
MacBook-Pro:directors-console admin$ git status
On branch day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
Your branch is up to date with 'origin/day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	canon/ledger_lite/export_pack/

nothing added to commit but untracked files present (use "git add" to track)
MacBook-Pro:directors-console admin$ nano ~/.zshrc
MacBook-Pro:directors-console admin$ source ~/.zshrc
MacBook-Pro:directors-console admin$ ab_guard_branch_clean
-bash: ab_guard_branch_clean: command not found
MacBook-Pro:directors-console admin$ echo $SHELL
/bin/bash
MacBook-Pro:directors-console admin$ cat >> ~/.bashrc <<'EOF'
> 
> # ===============================
> # AB GUARD — Branch Clean Check
> # ===============================
> ab_guard_branch_clean() {
>   echo "🤠 AB GUARD — Branch Clean Check"
>   echo "=============================="
>   echo ""
> 
>   BRANCH=$(git branch --show-current 2>/dev/null)
>   if [ -z "$BRANCH" ]; then
>     echo "❌ Not inside a git repo."
>     return 1
>   fi
> 
>   echo "🌿 Branch: $BRANCH"
>   echo ""
> 
>   STATUS=$(git status --porcelain)
> 
>   if [ -z "$STATUS" ]; then
>     echo "✅ Working tree clean."
>     return 0
>   fi
> 
>   echo "🚨 Working tree NOT clean:"
>   echo "$STATUS"
>   echo ""
> 
>   # Block if untracked canon/ or evidence/
>   UNTRACKED=$(echo "$STATUS" | grep '^??' | awk '{print $2}')
>   CANON_OR_EVIDENCE=$(echo "$UNTRACKED" | grep -E '^(canon/|evidence/)' || true)
> 
>   if [ -n "$CANON_OR_EVIDENCE" ]; then
>     echo "❌ Blocked: Untracked Canon/Evidence files detected:"
>     echo "$CANON_OR_EVIDENCE"
>     echo ""
>     echo "✅ Fix: add them, move them, or delete them before continuing."
>     return 1
>   fi
> 
>   # Block if modified evidence file exists
>   MODIFIED_EVIDENCE=$(echo "$STATUS" | grep '^ M evidence/' | awk '{print $2}' || true)
>   if [ -n "$MODIFIED_EVIDENCE" ]; then
>     echo "❌ Blocked: Modified evidence file detected:"
>     echo "$MODIFIED_EVIDENCE"
>     echo ""
>     echo "✅ Fix: restore it before continuing:"
>     echo "➡️ git restore $MODIFIED_EVIDENCE"
>     return 1
>   fi
> 
>   echo "⚠️ Branch not clean, but no Canon/Evidence violations found."
>   echo "✅ You may continue, but review changes carefully."
>   return 1
> }
> 
> EOF
MacBook-Pro:directors-console admin$ source ~/.bashrc
MacBook-Pro:directors-console admin$ type ab_guard_branch_clean
ab_guard_branch_clean is a function
ab_guard_branch_clean () 
{ 
    echo "🤠 AB GUARD — Branch Clean Check";
    echo "==============================";
    echo "";
    BRANCH=$(git branch --show-current 2>/dev/null);
    if [ -z "$BRANCH" ]; then
        echo "❌ Not inside a git repo.";
        return 1;
    fi;
    echo "🌿 Branch: $BRANCH";
    echo "";
    STATUS=$(git status --porcelain);
    if [ -z "$STATUS" ]; then
        echo "✅ Working tree clean.";
        return 0;
    fi;
    echo "🚨 Working tree NOT clean:";
    echo "$STATUS";
    echo "";
    UNTRACKED=$(echo "$STATUS" | grep '^??' | awk '{print $2}');
    CANON_OR_EVIDENCE=$(echo "$UNTRACKED" | grep -E '^(canon/|evidence/)' || true);
    if [ -n "$CANON_OR_EVIDENCE" ]; then
        echo "❌ Blocked: Untracked Canon/Evidence files detected:";
        echo "$CANON_OR_EVIDENCE";
        echo "";
        echo "✅ Fix: add them, move them, or delete them before continuing.";
        return 1;
    fi;
    MODIFIED_EVIDENCE=$(echo "$STATUS" | grep '^ M evidence/' | awk '{print $2}' || true);
    if [ -n "$MODIFIED_EVIDENCE" ]; then
        echo "❌ Blocked: Modified evidence file detected:";
        echo "$MODIFIED_EVIDENCE";
        echo "";
        echo "✅ Fix: restore it before continuing:";
        echo "➡️ git restore $MODIFIED_EVIDENCE";
        return 1;
    fi;
    echo "⚠️ Branch not clean, but no Canon/Evidence violations found.";
    echo "✅ You may continue, but review changes carefully.";
    return 1
}
MacBook-Pro:directors-console admin$ ab_guard_branch_clean
🤠 AB GUARD — Branch Clean Check
==============================

🌿 Branch: day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-

🚨 Working tree NOT clean:
?? canon/ledger_lite/export_pack/

❌ Blocked: Untracked Canon/Evidence files detected:
canon/ledger_lite/export_pack/

✅ Fix: add them, move them, or delete them before continuing.
MacBook-Pro:directors-console admin$ grep -q "source ~/.bashrc" ~/.bash_profile 2>/dev/null || echo "source ~/.bashrc" >> ~/.bash_profile
MacBook-Pro:directors-console admin$ source ~/.bash_profile
MacBook-Pro:directors-console admin$ ls -la canon/ledger_lite/export_pack/
total 8
drwxr-xr-x  3 admin  staff   96 Jan  3 16:49 .
drwxr-xr-x  7 admin  staff  224 Jan  3 16:48 ..
-rw-r--r--  1 admin  staff  492 Jan  3 16:49 export_pack_csv_accountant_bundle_v0.1.md
MacBook-Pro:directors-console admin$ git add canon/ledger_lite/export_pack/
MacBook-Pro:directors-console admin$ git status
On branch day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
Your branch is up to date with 'origin/day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   canon/ledger_lite/export_pack/export_pack_csv_accountant_bundle_v0.1.md

MacBook-Pro:directors-console admin$ git commit -m "Day 7 Issue #39: Export Pack spec v0.1 + evidence stub"
[day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv- 761575a] Day 7 Issue #39: Export Pack spec v0.1 + evidence stub
 1 file changed, 5 insertions(+)
 create mode 100644 canon/ledger_lite/export_pack/export_pack_csv_accountant_bundle_v0.1.md
MacBook-Pro:directors-console admin$ git push
Enumerating objects: 9, done.
Counting objects: 100% (9/9), done.
Delta compression using up to 8 threads
Compressing objects: 100% (6/6), done.
Writing objects: 100% (6/6), 808 bytes | 808.00 KiB/s, done.
Total 6 (delta 3), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To https://github.com/AlligatorBrainProjects/directors-console.git
   64f5759..761575a  day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv- -> day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-
MacBook-Pro:directors-console admin$ ab_guard_branch_clean
🤠 AB GUARD — Branch Clean Check
==============================

🌿 Branch: day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-

✅ Working tree clean.
MacBook-Pro:directors-console admin$ gh pr view 47 --repo AlligatorBrainProjects/directors-console --web
Opening https://github.com/AlligatorBrainProjects/directors-console/pull/47 in your browser.
MacBook-Pro:directors-console admin$ ab_parallel_label 47 AlligatorBrainProjects/directors-console 39
🏷️ PARALLEL LABELER — PR #47
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Found PR: #47 | Day 7 (Parallel): Issue #39 — Export Pack (CSV + Accountant Bundle) spec v0.1 + evidence
State: OPEN
URL: https://github.com/AlligatorBrainProjects/directors-console/pull/47

✅ Applying labels...
✅ Labels applied.

🧩 Linking to Issue #39...
✅ Issue updated: #39

🚀 Next steps:
➡️ Review PR: gh pr view 47 --repo "AlligatorBrainProjects/directors-console" --web
➡️ Keep it parallel until promoted.
MacBook-Pro:directors-console admin$ ab_pack_rollcall
🐊 AB PACK ROLLCALL — Pack A (#36–#40)
Repo: AlligatorBrainProjects/directors-console
==============================

📌 Open PRs: 3

------------------------------
🧩 Pack A Issue → PR Status
------------------------------
🟡 #36 OPEN — Call Sheet — Day 7 — Tier 1 Ledger Lite Spec (v0.1) — [SPINE CANDIDATE]
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/36
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

🟡 #37 OPEN — Call Sheet — Day 7 — Ledger Lite: Income + Expense Entry UI (MVP)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/37
   ✅ PR #45: Day 7 (Parallel): Issue #37 — Income + Expense Entry UI MVP spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/45

🟡 #38 OPEN — Call Sheet — Day 7 — Ledger Lite: Receipt Capture (Photo → OCR → Entry)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/38
   ✅ PR #46: Day 7 (Parallel): Issue #38 — Receipt Capture Photo→OCR→Entry spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/46

🟡 #39 OPEN — Call Sheet — Day 7 — Ledger Lite: Export Pack (CSV + Accountant Bundle)
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/39
   ✅ PR #47: Day 7 (Parallel): Issue #39 — Export Pack (CSV + Accountant Bundle) spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/47

🟡 #40 OPEN — Call Sheet — Day 7 — Ledger Lite: Evidence + Audit Trail Rules
   🔗 https://github.com/AlligatorBrainProjects/directors-console/issues/40
   ✅ PR #43: Day 7 (Spine): Ledger Lite Spec v0.1 + evidence | https://github.com/AlligatorBrainProjects/directors-console/pull/43

------------------------------
📌 Pack Summary
------------------------------
✅ Closed: 0 | 🟡 Open: 5

------------------------------
🚀 Next Suggested Action
------------------------------
➡️ You have open PRs. Run: ab_pr_open
MacBook-Pro:directors-console admin$ ab_guard_branch_clean
🤠 AB GUARD — Branch Clean Check
==============================

🌿 Branch: day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-

✅ Working tree clean.
MacBook-Pro:directors-console admin$ nano ~/.bashrc
MacBook-Pro:directors-console admin$ source ~/.bashrc
MacBook-Pro:directors-console admin$ type ab_pack_fix_dirty
ab_pack_fix_dirty is a function
ab_pack_fix_dirty () 
{ 
    echo "🐊 AB PACK FIX DIRTY — Canon/Evidence Auto Repair";
    echo "===============================================";
    echo "";
    BRANCH=$(git branch --show-current 2>/dev/null);
    if [ -z "$BRANCH" ]; then
        echo "❌ Not inside a git repo.";
        return 1;
    fi;
    echo "🌿 Branch: $BRANCH";
    echo "";
    STATUS=$(git status --porcelain);
    if [ -z "$STATUS" ]; then
        echo "✅ Working tree clean — nothing to fix.";
        return 0;
    fi;
    echo "🚨 Working tree dirty:";
    echo "$STATUS";
    echo "";
    UNTRACKED=$(echo "$STATUS" | grep '^??' | awk '{print $2}');
    MODIFIED=$(echo "$STATUS" | grep '^ M' | awk '{print $2}');
    CANON_UNTRACKED=$(echo "$UNTRACKED" | grep -E '^(canon/|evidence/)' || true);
    EVIDENCE_MODIFIED=$(echo "$MODIFIED" | grep '^evidence/' || true);
    echo "📌 Detected Canon/Evidence Problems:";
    echo "-----------------------------------";
    if [ -n "$CANON_UNTRACKED" ]; then
        echo "❌ Untracked Canon/Evidence:";
        echo "$CANON_UNTRACKED";
        echo "";
    fi;
    if [ -n "$EVIDENCE_MODIFIED" ]; then
        echo "❌ Modified evidence file(s):";
        echo "$EVIDENCE_MODIFIED";
        echo "";
    fi;
    if [ -z "$CANON_UNTRACKED" ] && [ -z "$EVIDENCE_MODIFIED" ]; then
        echo "✅ No Canon/Evidence violations found.";
        echo "⚠️ Dirty tree exists, but safe to continue.";
        return 0;
    fi;
    echo "";
    echo "Choose Fix:";
    echo "  1) Stage Canon/Evidence + commit";
    echo "  2) Restore evidence changes (discard modified evidence)";
    echo "  3) Cancel (do nothing)";
    echo "";
    read -r -p "🤠 Select option (1/2/3): " OPT;
    if [ "$OPT" = "1" ]; then
        echo "";
        echo "✅ Staging Canon/Evidence files...";
        git add canon/ evidence/ 2> /dev/null;
        echo "";
        read -r -p "📝 Commit message: " MSG;
        if [ -z "$MSG" ]; then
            MSG="Fix: stage Canon/Evidence artifacts";
        fi;
        git commit -m "$MSG";
        echo "";
        echo "✅ Done. Now push:";
        echo "➡️ git push";
    else
        if [ "$OPT" = "2" ]; then
            echo "";
            echo "🧼 Restoring modified evidence files...";
            for f in $EVIDENCE_MODIFIED;
            do
                git restore "$f";
            done;
            echo "";
            echo "✅ Evidence restored. Re-run:";
            echo "➡️ ab_guard_branch_clean";
        else
            echo "🛑 Cancelled.";
            return 0;
        fi;
    fi
}
MacBook-Pro:directors-console admin$ ab_pack_fix_dirty
🐊 AB PACK FIX DIRTY — Canon/Evidence Auto Repair
===============================================

🌿 Branch: day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-

✅ Working tree clean — nothing to fix.
MacBook-Pro:directors-console admin$ type ab_pack_fix_dirty
ab_pack_fix_dirty is a function
ab_pack_fix_dirty () 
{ 
    echo "🐊 AB PACK FIX DIRTY — Canon/Evidence Auto Repair";
    echo "===============================================";
    echo "";
    BRANCH=$(git branch --show-current 2>/dev/null);
    if [ -z "$BRANCH" ]; then
        echo "❌ Not inside a git repo.";
        return 1;
    fi;
    echo "🌿 Branch: $BRANCH";
    echo "";
    STATUS=$(git status --porcelain);
    if [ -z "$STATUS" ]; then
        echo "✅ Working tree clean — nothing to fix.";
        return 0;
    fi;
    echo "🚨 Working tree dirty:";
    echo "$STATUS";
    echo "";
    UNTRACKED=$(echo "$STATUS" | grep '^??' | awk '{print $2}');
    MODIFIED=$(echo "$STATUS" | grep '^ M' | awk '{print $2}');
    CANON_UNTRACKED=$(echo "$UNTRACKED" | grep -E '^(canon/|evidence/)' || true);
    EVIDENCE_MODIFIED=$(echo "$MODIFIED" | grep '^evidence/' || true);
    echo "📌 Detected Canon/Evidence Problems:";
    echo "-----------------------------------";
    if [ -n "$CANON_UNTRACKED" ]; then
        echo "❌ Untracked Canon/Evidence:";
        echo "$CANON_UNTRACKED";
        echo "";
    fi;
    if [ -n "$EVIDENCE_MODIFIED" ]; then
        echo "❌ Modified evidence file(s):";
        echo "$EVIDENCE_MODIFIED";
        echo "";
    fi;
    if [ -z "$CANON_UNTRACKED" ] && [ -z "$EVIDENCE_MODIFIED" ]; then
        echo "✅ No Canon/Evidence violations found.";
        echo "⚠️ Dirty tree exists, but safe to continue.";
        return 0;
    fi;
    echo "";
    echo "Choose Fix:";
    echo "  1) Stage Canon/Evidence + commit";
    echo "  2) Restore evidence changes (discard modified evidence)";
    echo "  3) Cancel (do nothing)";
    echo "";
    read -r -p "🤠 Select option (1/2/3): " OPT;
    if [ "$OPT" = "1" ]; then
        echo "";
        echo "✅ Staging Canon/Evidence files...";
        git add canon/ evidence/ 2> /dev/null;
        echo "";
        read -r -p "📝 Commit message: " MSG;
        if [ -z "$MSG" ]; then
            MSG="Fix: stage Canon/Evidence artifacts";
        fi;
        git commit -m "$MSG";
        echo "";
        echo "✅ Done. Now push:";
        echo "➡️ git push";
    else
        if [ "$OPT" = "2" ]; then
            echo "";
            echo "🧼 Restoring modified evidence files...";
            for f in $EVIDENCE_MODIFIED;
            do
                git restore "$f";
            done;
            echo "";
            echo "✅ Evidence restored. Re-run:";
            echo "➡️ ab_guard_branch_clean";
        else
            echo "🛑 Cancelled.";
            return 0;
        fi;
    fi
}
MacBook-Pro:directors-console admin$ ab_pack_fix_dirty
🐊 AB PACK FIX DIRTY — Canon/Evidence Auto Repair
===============================================

🌿 Branch: day7-issue39-call-sheet-day-7-ledger-lite-export-pack-csv-

✅ Working tree clean — nothing to fix.
MacBook-Pro:directors-console admin$ nano ~/.bashrc
MacBook-Pro:directors-console admin$ source ~/.bashrc
MacBook-Pro:directors-console admin$ ab_pack_close 44
🐊 AB PACK CLOSE — PR #44
Repo: AlligatorBrainProjects/directors-console
==============================

❌ PR #44 not found.
MacBook-Pro:directors-console admin$ gh pr view 44 --repo AlligatorBrainProjects/directors-console
Day 3 (20%): Call Sheet template adds spine preflight + label check AlligatorBrainProjects/directors-console#44
Merged • AlligatorBrain wants to merge 1 commit into main from day3-call-sheet-template-label-preflight • about 1 hour ago
+6 -0 • No checks
Labels: canon, evidence-required, spine-candidate, spine-merge

  Adds required Spine merge preflight checklist to Call Sheet template to     
  prevent label/evidence drift.                                               

View this pull request on GitHub: https://github.com/AlligatorBrainProjects/directors-console/pull/44
MacBook-Pro:directors-console admin$ gh auth status
github.com
  ✓ Logged in to github.com account AlligatorBrain (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'project', 'read:org', 'repo', 'workflow'
MacBook-Pro:directors-console admin$ ab_pack_close() {
>   PR=$1
>   REPO=${2:-AlligatorBrainProjects/directors-console}
> 
>   if [ -z "$PR" ]; then
>     echo "❌ Usage: ab_pack_close <PR_NUMBER> [REPO]"
>     return 1
>   fi
> 
>   echo "🐊 AB PACK CLOSE — PR #$PR"
>   echo "Repo: $REPO"
>   echo "=============================="
>   echo ""
> 
>   # ✅ Confirm PR exists + get info
>   JSON=$(gh pr view "$PR" --repo "$REPO" --json number,title,state,url 2>/dev/null)
> 
>   if [ -z "$JSON" ]; then
>     echo "❌ PR #$PR not found in repo: $REPO"
>     echo "✅ Try: gh pr view $PR --repo $REPO"
>     return 1
>   fi
> 
>   TITLE=$(echo "$JSON" | jq -r '.title')
>   STATE=$(echo "$JSON" | jq -r '.state')
>   URL=$(echo "$JSON" | jq -r '.url')
> 
>   echo "📌 Found PR: #$PR | $TITLE"
>   echo "State: $STATE"
>   echo "URL: $URL"
>   echo ""
> 
>   if [ "$STATE" = "MERGED" ]; then
>     echo "✅ Already merged — nothing to close."
>     return 0
>   fi
> 
>   if [ "$STATE" != "OPEN" ]; then
>     echo "❌ PR not open (state=$STATE) — cannot merge."
>     return 1
>   fi
> 
>   echo "🚨 Merge PR #$PR now? (y/n): "
>   read -r CONFIRM
> 
>   if [ "$CONFIRM" != "y" ]; then
>     echo "🛑 Cancelled."
>     return 0
>   fi
> 
>   echo ""
>   echo "🤠 Merging PR #$PR..."
>   gh pr merge "$PR" --repo "$REPO" --merge --delete-branch
> 
>   echo "✅ DONE — PR merged and branch deleted."
> }
MacBook-Pro:directors-console admin$ nano ~/.bashrc
MacBook-Pro:directors-console admin$ nano ~/.bashrc

  UW PICO 5.09                   File: /Users/admin/.bashrc                     

    return 1
  fi
  
  TITLE=$(echo "$JSON" | jq -r '.title')
  STATE=$(echo "$JSON" | jq -r '.state')
  MERGED=$(echo "$JSON" | jq -r '.merged')
  URL=$(echo "$JSON" | jq -r '.url')
  BODY=$(echo "$JSON" | jq -r '.body')
    
  echo "📌 PR: #$PR | $TITLE"
  echo "State: $STATE | Merged: $MERGED"
  echo "URL: $URL"
  echo ""
    
  if [ "$MERGED" != "true" ]; then
    echo "❌ Blocked: PR is not merged yet."
    echo "✅ Merge it first, then run again."
    return 1
  fi
    
  ISSUE=$(echo "$BODY" | grep -oE 'Closes #[0-9]+' | head -n 1 | grep -oE '[0-9$
    
  if [ -z "$ISSUE" ]; then   
    ISSUE=$(echo "$TITLE" | grep -oE '#[0-9]+' | head -n 1 | tr -d '#' || true)
  fi
    
  if [ -z "$ISSUE" ]; then
    echo "⚠️ Could not detect Issue number."
    echo "✅ You can run manually:"
    echo "➡️ gh issue close <ISSUE#> --repo \"$REPO\""
    return 1
  fi
  
  echo "🧩 Closing Issue #$ISSUE..."
  gh issue comment "$ISSUE" --repo "$REPO" --body \
"✅ **Pack PR merged + closed**
- PR: $URL
- Title: $TITLE
✅ This issue is now COMPLETE."
  
  gh issue close "$ISSUE" --repo "$REPO"
  
  echo "✅ Issue #$ISSUE closed."
  echo ""
  echo "🚀 Next step:"
  echo "➡️ ab_pack_status"
}   
  