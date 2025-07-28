export function verificarPermissao(...rolesPermitidos) {
  return (req, res, next) => {
    const cargo = req.usuario.cargo;

    if (!rolesPermitidos.includes(cargo)) {
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente' });
    }

    next();
  };
}
