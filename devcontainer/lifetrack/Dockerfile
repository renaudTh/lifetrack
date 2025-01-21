FROM ubuntu:22.04

ARG USERNAME="user"
ARG USER_UID="1000"
ARG USER_GID="${USER_UID}"
ARG SCRIPT_PATH="."

# ===========================
# Global setup
# ===========================

# Set timezone to avoid tzdata hangs in apt-get
ENV TZ="Europe/Paris"
RUN ln -snf "/usr/share/zoneinfo/${TZ}" "/etc/localtime" && echo "${TZ}" > /etc/timezone

# Install packages
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -y && apt-get install -y               \
curl wget ca-certificates                             \
locales build-essential gdb                           \
git git-lfs                                           \
sudo zip unzip tar tree htop zsh vim                  \
python3 python3-pip python-is-python3                 \
bat jq                                                \
texinfo pkg-config                                    \
moreutils                                             \
exa bat ripgrep                                       \
swaks                                                 

#Install rust
RUN apt-get update -y && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN cargo install wasm-pack

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Create user & add it to the sudoers
RUN groupadd --gid "${USER_GID}" "${USERNAME}"                                             \
    && useradd --uid "${USER_UID}" --gid "${USER_GID}" --shell "/bin/zsh" -m "${USERNAME}" \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/${USERNAME}"          \
    && chmod 0440 "/etc/sudoers.d/${USERNAME}"

# ===========================
# User-land installation
# ===========================

USER ${USERNAME}

ENV GIT_EDITOR="code --wait"

# Install Oh My Zsh - A ZSH Customizer & plugin manager - ( https://ohmyz.sh )
RUN curl "https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh" -fsSL | sh
RUN git clone https://github.com/zsh-users/zsh-autosuggestions /home/${USERNAME}/.oh-my-zsh/custom/plugins/zsh-autosuggestions
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git /home/${USERNAME}/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting


# Install NVM and node, npm
# Todo: use static versions
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
ENV NVM_DIR="/home/${USERNAME}/.nvm"
RUN . ~/.nvm/nvm.sh && nvm install node --latest-npm

WORKDIR /home/${USERNAME}
