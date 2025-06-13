DELIMITER //

CREATE TRIGGER limitar_tags_usuario
BEFORE INSERT ON usuario_tag
FOR EACH ROW
BEGIN
    DECLARE qtd_tags INT;

    SELECT COUNT(*) INTO qtd_tags
    FROM usuario_tag
    WHERE id_usuario = NEW.id_usuario;

    IF qtd_tags >= 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Um usuário não pode ter mais de 5 tags.';
    END IF;
END;
//

DELIMITER ;
