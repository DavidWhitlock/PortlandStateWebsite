;; Switch the "Delete" and "Backspace" keys.

(defvar running-xemacs (string-match "XEmacs\\|Lucid" emacs-version))

(require 'cl)
;; Define backspace key for Non-X Emacs
;;
;; (when (not window-system)
;;   (setq key-translation-map (make-sparse-keymap))
;;   (define-key key-translation-map "\177" "\C-h")
;;   (define-key key-translation-map "\C-h" "\177")
;;   (defvar BACKSPACE "\177")
;;   (defvar DELETE    "\C-h")
;;   (global-set-key BACKSPACE 'backward-delete-char)
;;   )

(setq load-path (cons "/u/whitlock/elisp" load-path))
(setq version-control t)
(setq gnus-default-nntp-server "usenet.cat.pdx.edu")

(line-number-mode t)
(column-number-mode t)
(setq-default lpr-command "lpr")
(setq search-highlight t);; highlight things being searched
(require 'setnu)                         ;; Line numbers
(require 'crypt++)                       ;; Get rid of DOS ^M

;;; Prevent Extraneous Tabs
(setq-default indent-tabs-mode nil)

;; VM Mailer
(setq load-path (cons "/u/whitlock/vm-7.19" load-path))
(autoload 'vm "vm" "Start VM on your primary inbox." t)
(autoload 'vm-other-frame "vm" "Like `vm' but starts in another frame." t)
(autoload 'vm-visit-folder "vm" "Start VM on an arbitrary folder." t)
(autoload 'vm-visit-virtual-folder "vm" "Visit a VM virtual folder." t)
(autoload 'vm-mode "vm" "Run VM major mode on a buffer" t)
(autoload 'vm-mail "vm" "Send a mail message using VM." t)
(autoload 'vm-submit-bug-report "vm" "Send a bug report about VM." t)

;; (setq vm-imap-account-alist
;; '(("imap-ssl:imap.gmail.com:993:*:login:sjavata@gmail.com:*")))

;; (setq vm-primary-inbox
;; "imap-ssl:imap.gmail.com:993:*:login:sjavata@gmail.com:*")

(setq version-control t)

;; (if (not (not running-xemacs))
;;     (autoload 'resize-minibuffer-mode "rsz-minibuf" nil t)
;;   (resize-minibuffer-mode)
;;   (setq resize-minibuffer-window-exactly nil))

;; lisp/modes/arc-mode.el needs the following or it lowercases
;; everything it displays from a jar.
(setq archive-zip-case-fiddle nil)

;; This adds additional extensions which indicate files normally
;; handled by cc-mode.
(setq auto-mode-alist
      (append '(("\\.C$"  . c++-mode)
		("\\.cc$" . c++-mode)
		("\\.hh$" . c++-mode)
		("\\.c$"  . c-mode)
		("\\.h$"  . c-mode)
		("\\.ht$" . c-mode)
		("\\.hf$" . c-mode)
		("\\.hc$" . c-mode)
		("\\.jar$" . archive-mode)
		("\\.ear$" . archive-mode)
		("\\.war$" . archive-mode))
	      auto-mode-alist))

;; Auto reload files
(autoload 'auto-revert-mode "autorevert" nil t)
(autoload 'turn-on-auto-revert-mode "autorevert" nil nil)
(autoload 'global-auto-revert-mode "autorevert" nil t)
(global-auto-revert-mode 1)

;; PSGML stuff
(setq load-path (cons "/u/whitlock/elisp/psgml-1.2.5" load-path))
(require 'psgml)
(add-to-list 'auto-mode-alist '("\\.html" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.adp" . xml-mode))
(add-to-list 'auto-mode-alist '("\\.xml" . xml-mode))
(add-to-list 'auto-mode-alist '("\\.xsl" . xml-mode))
           
(add-to-list 'sgml-catalog-files "/u/whitlock/dtds/CATALOG")

(define-key sgml-mode-map "\C-c\C-x\C-e" 'sgml-describe-element-type)
(define-key sgml-mode-map "\C-c\C-x\C-i" 'sgml-general-dtd-info)
(define-key sgml-mode-map "\C-c\C-x\C-t" 'sgml-describe-entity)

;; LaTeX mode (auctex)
(require 'tex-site)

;; Indent 2 spaces in C-mode
(setq-default c-basic-offset 2)

(defun my-c-mode-common-hook ()
  ;; my customizations for all of c-mode and related modes
  (setq c-basic-offset 2)
  ;; other customizations can go here
  )
(add-hook 'c-mode-common-hook 'my-c-mode-common-hook)
(add-hook 'c-mode-common-hook 'turn-on-auto-fill)

;; Keyboard commands
(global-set-key "\C-x\C-l" 'goto-line)

(setq mail-archive-file-name "~/.folders/Sent")
(setq mail-default-reply-to (concat (user-login-name) "@cs.pdx.edu"))
(setq mail-mode-hook '(lambda () (auto-save-mode 1) (mail-abbrevs-mode 1)))
(setq mail-use-rfc822 t)

(mail-abbrevs-mode t)
(setq mail-abbrev-mailrc-file "~/.mailrc")
(if (not running-xemacs)
    (add-hook 'mail-setup-hook 'mail-abbrevs-setup))

;;; Supercite setup
(autoload 'sc-cite-original     "supercite" "Supercite 3.1" t)
(autoload 'sc-submit-bug-report "supercite" "Supercite 3.1" t)
(add-hook 'mail-citation-hook 'sc-cite-original)

;; AUCTEX stuff
;; (require 'tex-site)
(setq TeX-parse-self t) ; Enable parse on load.
(setq TeX-auto-save t) ; Enable parse on save.
(setq-default TeX-master nil)

(display-time)

;; Diary reminders
;;(add-hook 'diary-hook 'appt-make-list)
;;(diary 0)

;; Decent colors
(set-face-background 'default      "black")     ; frame background
(set-face-foreground 'default      "white")     ; text foreground

;; Make the sequence "C-x w" execute the `what-line' command, 
;; which prints the current line number in the echo area.
(global-set-key "\C-xw" 'what-line)


(custom-set-variables
 '(jde-use-font-lock nil)
 '(sc-use-only-preference-p t)
 '(font-lock-auto-fontify nil)
 '(sc-confirm-always-p nil)
 '(sc-default-author-name "You")
 '(column-number-mode t)
 '(sc-default-attribution "You")
 '(sc-fixup-whitespace-p t)
 '(kept-old-versions 1)
 '(appt-display-duration 20 t)
 '(appt-issue-message t)
 '(diary-schedule-time-display-format "12:mm" t)
 '(display-time-mode t nil (time))
 '(diary-schedule-interval-time 60 t)
 '(appt-audible t)
 '(toolbar-visible-p nil)
 '(quote (jde-run-working-directory ""))
 '(mark-diary-entries-in-calendar t)
 '(kept-new-versions 1)
 '(view-diary-entries-initially t)
 '(c-basic-offset 2 t)
 '(calendar-latitude 45.6)
 '(display-time-day-and-date t)
 '(calendar-longitude -122.6)
 '(sc-downcase-p t)
 '(user-mail-address (concat (user-login-name) "@cs.pdx.edu") t)
 '(query-user-mail-address nil)
 '(sc-citation-leader "")
)
(custom-set-faces)


;;; Commands added by calc-private-autoloads on Thu Jul  6 09:39:53 2000.
(autoload 'calc-dispatch	   "calc" "Calculator Options" t)
(autoload 'full-calc		   "calc" "Full-screen Calculator" t)
(autoload 'full-calc-keypad	   "calc" "Full-screen X Calculator" t)
(autoload 'calc-eval		   "calc" "Use Calculator from Lisp")
(autoload 'defmath		   "calc" nil t t)
(autoload 'calc			   "calc" "Calculator Mode" t)
(autoload 'quick-calc		   "calc" "Quick Calculator" t)
(autoload 'calc-keypad		   "calc" "X windows Calculator" t)
(autoload 'calc-embedded	   "calc" "Use Calc inside any buffer" t)
(autoload 'calc-embedded-activate  "calc" "Activate =>'s in buffer" t)
(autoload 'calc-grab-region	   "calc" "Grab region of Calc data" t)
(autoload 'calc-grab-rectangle	   "calc" "Grab rectangle of data" t)
(global-set-key "\e#" 'calc-dispatch)
;;; End of Calc autoloads.


(setq minibuffer-max-depth nil)
