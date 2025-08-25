export function verificarPermissao(...rolesPermitidos) {
  return (req, res, next) => {
    const cargo = req.usuario.cargo;
    const permissoes = req.usuario.permissoes

    if (!rolesPermitidos.includes(cargo) || !rolesPermitidos.includes(permissoes)) {
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente' });
    }

    next();
  };
}
